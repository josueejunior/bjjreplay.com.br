/** Chamados do aluno (reportar erro) e fila do admin. */
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  CHAMADO_STATUS, CHAMADO_TIPOS, OPCOES_PROBLEMA, STATUS_DO_TIPO, atualizarChamado, chamadoPorId, chamadosDo,
  criarChamado, lerPrint, todosChamados, toChamado,
} from '../lib/chamados.db.js';
import type { JwtPayload } from '../plugins/auth.js';

export async function chamadosRoutes(app: FastifyInstance) {
  /* -------------------------------- aluno -------------------------------- */
  app.post('/api/chamados', { preHandler: [app.authenticate] }, async (request, reply) => {
    const payload = request.user as JwtPayload;
    const body = z
      .object({
        tipo: z.enum(['erro']).default('erro'),
        texto: z.string().trim().min(10, 'Conte o que aconteceu (mínimo 10 letras)').max(1000),
        tela: z.string().trim().max(120).optional().nullable(),
        print: z.string().max(2_200_000).optional().nullable(),
      })
      .parse(request.body);
    const l = criarChamado({ userId: payload.sub, tipo: body.tipo, texto: body.texto, tela: body.tela, printDataUrl: body.print });
    return reply.code(201).send(toChamado(l));
  });

  /**
   * "Minha luta não foi encontrada": vale para todo aluno logado, com dia e horário.
   * Lucas (04/11/2026): não aceita mais de 7 dias para trás.
   */
  app.post('/api/chamados/luta', { preHandler: [app.authenticate] }, async (request, reply) => {
    const payload = request.user as JwtPayload;
    const body = z
      .object({
        data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data da luta inválida'),
        horario: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Informe o horário aproximado da luta'),
        tatame: z.string().trim().min(1, 'Escolha o tatame').max(40),
        adversario: z.string().trim().max(80).optional().nullable(),
        faltaram: z.coerce.number().int().min(1, 'Quantas lutas faltaram?').max(20),
        observacao: z.string().trim().max(280).optional().nullable(),
      })
      .parse(request.body);

    const hoje = new Date().toISOString().slice(0, 10);
    if (body.data > hoje) return reply.code(400).send({ detail: 'A data da luta não pode ser no futuro' });
    const dias = Math.floor((Date.parse(hoje) - Date.parse(body.data)) / 86_400_000);
    if (dias > 7) {
      return reply.code(400).send({ detail: 'Só dá para pedir a busca de lutas dos últimos 7 dias' });
    }
    const l = criarChamado({
      userId: payload.sub,
      tipo: 'luta_nao_encontrada',
      tela: `${body.data} ${body.horario}`,
      texto: body.observacao?.trim() || `Faltaram ${body.faltaram} luta(s) em ${body.data} por volta de ${body.horario}.`,
      extra: {
        data: body.data, horario: body.horario, tatame: body.tatame,
        adversario: body.adversario?.trim() || null, faltaram: body.faltaram,
      },
    });
    return reply.code(201).send(toChamado(l));
  });

  /** "Relatar um problema" numa luta: Não sou eu / começa comigo e termina com outra pessoa / corte errado. */
  app.post('/api/chamados/problema', { preHandler: [app.authenticate] }, async (request, reply) => {
    const payload = request.user as JwtPayload;
    const body = z
      .object({
        opcao: z.enum(OPCOES_PROBLEMA, { errorMap: () => ({ message: 'Escolha o que aconteceu' }) }),
        luta: z.string().trim().max(120).optional().nullable(),
        observacao: z.string().trim().min(5, 'Descreva em poucas palavras').max(500),
      })
      .parse(request.body);
    const l = criarChamado({
      userId: payload.sub,
      tipo: 'problema_luta',
      tela: body.luta || null,
      texto: body.observacao,
      extra: { opcao: body.opcao, luta: body.luta || null },
    });
    return reply.code(201).send(toChamado(l));
  });

  app.get('/api/chamados/meus', { preHandler: [app.authenticate] }, async (request) =>
    chamadosDo((request.user as JwtPayload).sub),
  );

  app.get<{ Params: { id: string } }>('/api/chamados/:id/print', { preHandler: [app.authenticate] }, async (request, reply) => {
    const u = request.user as JwtPayload;
    const l = chamadoPorId(request.params.id);
    if (!l || (l.user_id !== u.sub && !u.isAdmin)) return reply.code(404).send({ detail: 'Não encontrado' });
    const p = lerPrint(l);
    if (!p) return reply.code(404).send({ detail: 'Sem print' });
    return reply.header('Content-Type', p.tipo).header('Cache-Control', 'private, max-age=300').send(p.buf);
  });

  /* -------------------------------- admin -------------------------------- */
  app.get<{ Querystring: { status?: string; tipo?: string } }>(
    '/api/admin/chamados', { preHandler: [app.requireAdmin] }, async (request) => {
      const q = z.object({
        status: z.enum(CHAMADO_STATUS as [string, ...string[]]).optional(),
        tipo: z.enum(CHAMADO_TIPOS as [string, ...string[]]).optional(),
      }).parse(request.query);
      return todosChamados({ status: q.status as never, tipo: q.tipo as never });
    });

  app.patch<{ Params: { id: string } }>(
    '/api/admin/chamados/:id', { preHandler: [app.requireAdmin] }, async (request, reply) => {
      const body = z.object({
        status: z.enum(CHAMADO_STATUS as [string, ...string[]]).optional(),
        resposta: z.string().trim().max(1000).nullable().optional(),
      }).parse(request.body);
      const atual = chamadoPorId(request.params.id);
      if (atual && body.status && !STATUS_DO_TIPO[atual.tipo].includes(body.status as never)) {
        return reply.code(400).send({ detail: 'Esse status não vale para este tipo de chamado' });
      }
      const l = atualizarChamado(request.params.id, body as never);
      if (!l) return reply.code(404).send({ detail: 'Chamado não encontrado' });
      return toChamado(l);
    });
}
