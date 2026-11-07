/**
 * Superfície máquina-a-máquina do site principal — o Mac da academia (Sentinela).
 *
 * Lucas 07/11/2026: "Nada de campeonato. Tem que ser na principal." Mesmo contrato do campeonato
 * (`/api/service/ping|atletas|atletas/:id/foto|upload-url|entregas|chamados`; sem `vetores`: o Mac vetoriza a foto), para o Mac só trocar o endereço base. A entrega cai
 * em `biblioteca_lutas` com a janela da luta (`inicio_luta_s`/`fim_luta_s`, docs/BETA_CONTRATO_ENTREGAS.md).
 *
 * A lista de atletas sai sem e-mail, telefone, CPF e data de nascimento: o Mac não precisa disso.
 * Autenticação: header `X-Service-Token`, nunca o login do admin.
 */
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../lib/db.js';
import { exigirJanela } from '../lib/janela-luta.js';
import { assinarUrlR2 } from '../lib/r2.js';
import { CHAMADO_STATUS, CHAMADO_TIPOS, toChamado, type ChamadoStatus, type ChamadoTipo } from '../lib/chamados.db.js';
import type { LutaBibliotecaRow } from '../types.js';

interface AtletaRow {
  id: string;
  name: string;
  belt: string;
  degree: number;
  athlete_category: string;
  academy_name: string | null;
  tem_foto: number;
}

export async function serviceRoutes(app: FastifyInstance) {
  app.get('/api/service/ping', { preHandler: [app.requireService] }, async (request) => ({
    ok: true,
    servico: request.servico?.label ?? null,
    site: 'principal',
  }));

  app.get('/api/service/atletas', { preHandler: [app.requireService] }, async () => {
    const rows = db
      .prepare(
        `SELECT id, name, belt, degree, athlete_category, academy_name,
                (avatar_url IS NOT NULL AND avatar_url != '') AS tem_foto
         FROM users WHERE role = 'atleta' AND is_admin = 0 ORDER BY name`,
      )
      .all() as AtletaRow[];
    return rows.map((row) => ({
      atletaId: row.id,
      nome: row.name,
      faixa: row.belt,
      grau: row.degree,
      categoria: row.athlete_category,
      academia: row.academy_name,
      /* Lucas 07/11: a foto vai direto para o Mac, que gera o vetor lá; o servidor não vetoriza. */
      fotoUrl: row.tem_foto ? `/api/service/atletas/${row.id}/foto` : null,
    }));
  });

  /**
   * Foto de rosto do cadastro (obrigatória no signup, guardada em `users.avatar_url` como data URL).
   * `no-store`: tem criança na lista, e foto de menor não fica em cache de disco do Mac.
   */
  app.get<{ Params: { id: string } }>(
    '/api/service/atletas/:id/foto',
    { preHandler: [app.requireService] },
    async (request, reply) => {
      const row = db
        .prepare(`SELECT avatar_url FROM users WHERE id = ? AND role = 'atleta' AND is_admin = 0`)
        .get(request.params.id) as { avatar_url: string | null } | undefined;
      if (!row) return reply.code(404).send({ detail: 'Atleta não encontrado' });
      const m = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/s.exec(row.avatar_url ?? '');
      if (!m) return reply.code(404).send({ detail: 'Atleta sem foto cadastrada' });
      return reply.type(m[1]!).header('Cache-Control', 'no-store').send(Buffer.from(m[2]!, 'base64'));
    },
  );

  /** URL assinada de PUT no R2: o Mac sobe o vídeo sem ter a chave do bucket. */
  app.post('/api/service/upload-url', { preHandler: [app.requireService] }, async (request, reply) => {
    const body = z
      .object({
        objectKey: z.string().min(1).max(400),
        ttl: z.number().int().min(1).max(86400).optional(),
      })
      .parse(request.body);

    const url = assinarUrlR2(body.objectKey, { metodo: 'PUT', ttl: body.ttl ?? 3600 });
    if (!url) return reply.code(503).send({ detail: 'R2 não configurado' });
    return { url, objectKey: body.objectKey };
  });

  /**
   * Registra o vídeo já subido no R2, uma chamada por atleta. Idempotente por `atletaId` + `luta` +
   * `objectKey`: repetir devolve a entrega existente e, se vier janela nova, atualiza só a janela
   * (o Mac pode refinar a borda depois).
   */
  app.post('/api/service/entregas', { preHandler: [app.requireService] }, async (request, reply) => {
    const body = z
      .object({
        atletaId: z.string().min(1),
        titulo: z.string().min(2).max(140),
        luta: z.string().max(80).nullable().optional(),
        tatame: z.string().max(40).nullable().optional(),
        adversario: z.string().max(80).nullable().optional(),
        objectKey: z.string().min(1).max(400),
        tamanhoBytes: z.number().int().min(0).default(0),
        duracaoS: z.number().int().min(0).nullable().optional(),
        inicio_luta_s: z.number().optional(),
        fim_luta_s: z.number().optional(),
      })
      .parse(request.body);

    const temJanela = body.inicio_luta_s !== undefined || body.fim_luta_s !== undefined;
    const janela = temJanela ? exigirJanela(body.inicio_luta_s, body.fim_luta_s) : null;

    const atleta = db.prepare('SELECT id FROM users WHERE id = ?').get(body.atletaId);
    if (!atleta) return reply.code(404).send({ detail: 'Atleta não encontrado' });

    const luta = body.luta ?? null;
    const repetida = db
      .prepare(
        `SELECT * FROM biblioteca_lutas
         WHERE aluno_id = ? AND match_label IS ? AND object_key = ?`,
      )
      .get(body.atletaId, luta, body.objectKey) as LutaBibliotecaRow | undefined;

    if (repetida) {
      if (janela) {
        db.prepare('UPDATE biblioteca_lutas SET inicio_luta_s = ?, fim_luta_s = ? WHERE id_luta = ?').run(
          janela.inicio_luta_s,
          janela.fim_luta_s,
          repetida.id_luta,
        );
      }
      return reply.code(200).send({ id: repetida.id_luta, jaExistia: true });
    }

    const agora = new Date().toISOString();
    const r = db
      .prepare(
        `INSERT INTO biblioteca_lutas (
           aluno_id, status, data, queued_at, include_reels, opponent_name, event_name,
           object_key, match_label, mat, duracao_s, inicio_luta_s, fim_luta_s
         ) VALUES (?, 'ENTREGUE', ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        body.atletaId,
        agora.slice(0, 10),
        agora,
        body.adversario ?? null,
        body.titulo,
        body.objectKey,
        luta,
        body.tatame ?? null,
        body.duracaoS ?? null,
        janela?.inicio_luta_s ?? null,
        janela?.fim_luta_s ?? null,
      );
    return reply.code(201).send({ id: Number(r.lastInsertRowid), jaExistia: false });
  });

  /**
   * Chamados ("Relatar um problema", "Não encontrei minha luta", erro no site) só para LEITURA, para o agente do
   * Lucas (Claude no Mac mini) rastrear os problemas (P1105-4). Sai o que o chamado diz (id, datas, tipo, texto, luta,
   * status); NÃO sai quem abriu (nome, e-mail, id do usuário), CPF nem print. Mesmo token de serviço do Mac.
   * Filtros: ?status=recebido&tipo=problema_luta&desde=<ISO>&limite=100 (padrão 100, máximo 500).
   */
  app.get<{ Querystring: { status?: string; tipo?: string; desde?: string; limite?: string } }>(
    '/api/service/chamados',
    { preHandler: [app.requireService] },
    async (request, reply) => {
      const { status, tipo, desde } = request.query;
      if (status && !CHAMADO_STATUS.includes(status as ChamadoStatus)) {
        return reply.code(400).send({ detail: `status inválido (${CHAMADO_STATUS.join(', ')})` });
      }
      if (tipo && !CHAMADO_TIPOS.includes(tipo as ChamadoTipo)) {
        return reply.code(400).send({ detail: `tipo inválido (${CHAMADO_TIPOS.join(', ')})` });
      }
      if (desde && Number.isNaN(Date.parse(desde))) {
        return reply.code(400).send({ detail: 'desde deve ser uma data ISO (2026-11-07T12:00:00Z)' });
      }
      const limite = Math.min(Math.max(Number(request.query.limite) || 100, 1), 500);
      const linhas = db
        .prepare(
          `SELECT * FROM chamados
           WHERE (@status IS NULL OR status = @status) AND (@tipo IS NULL OR tipo = @tipo)
             AND (@desde IS NULL OR created_at >= @desde)
           ORDER BY created_at DESC LIMIT @limite`,
        )
        .all({ status: status ?? null, tipo: tipo ?? null, desde: desde ? new Date(desde).toISOString() : null, limite });
      return (linhas as Parameters<typeof toChamado>[0][]).map((l) => {
        const { temPrint, ...resto } = toChamado(l);
        void temPrint;
        return resto;
      });
    },
  );
}
