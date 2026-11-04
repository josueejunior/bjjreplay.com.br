/** "Ajude a melhorar": contagem de lutas por dia e perguntas do Córtex (beta). */
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getBibliotecaByAluno } from '../services/biblioteca.service.js';
import {
  contagensDesde, contagensDo, perguntaPorId, perguntasDo, publicarPergunta,
  respostasCortexDesde, responderPergunta, resumoAjuda, salvarContagem,
} from '../lib/ajuda.db.js';
import type { JwtPayload } from '../plugins/auth.js';

const DIAS_JANELA = 7;

/** Dia civil em São Paulo (YYYY-MM-DD), como no resto do beta. */
function diaSP(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(d);
}

export async function ajudaRoutes(app: FastifyInstance) {
  /** Por dia dos últimos 7: "O sistema encontrou N lutas suas" + a resposta que o aluno já deu. */
  app.get('/api/ajuda/contagem', { preHandler: [app.authenticate] }, async (request) => {
    const u = request.user as JwtPayload;
    const lutas = await getBibliotecaByAluno(u.sub);
    const porDia = new Map<string, number>();
    for (const l of lutas) {
      const dia = l.data.slice(0, 10);
      porDia.set(dia, (porDia.get(dia) ?? 0) + 1);
    }
    const dadas = new Map(contagensDo(u.sub).map((r) => [r.dia, r]));
    const hoje = Date.now();
    return Array.from({ length: DIAS_JANELA }, (_, i) => {
      const dia = diaSP(new Date(hoje - i * 86_400_000));
      const r = dadas.get(dia);
      return {
        dia,
        encontradas: porDia.get(dia) ?? 0,
        resposta: r ? { resultado: r.resultado, quantas: r.quantas, adversarios: r.adversarios } : null,
      };
    });
  });

  app.post('/api/ajuda/contagem', { preHandler: [app.authenticate] }, async (request, reply) => {
    const u = request.user as JwtPayload;
    const body = z
      .object({
        dia: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Dia inválido'),
        encontradas: z.coerce.number().int().min(0).max(30),
        resultado: z.enum(['certo', 'mais', 'menos']),
        quantas: z.coerce.number().int().min(0, 'Informe quantas lutas você fez').max(30),
        adversarios: z.string().trim().max(200).optional().nullable(),
      })
      .refine((b) => b.resultado !== 'certo' || b.quantas === b.encontradas, { message: 'Se está certo, a quantidade é a mesma que o sistema achou' })
      .refine((b) => b.resultado !== 'mais' || b.quantas > b.encontradas, { message: 'Fiz mais: a quantidade precisa ser maior que a do sistema' })
      .refine((b) => b.resultado !== 'menos' || b.quantas < b.encontradas, { message: 'Fiz menos: a quantidade precisa ser menor que a do sistema' })
      .parse(request.body);
    const hoje = diaSP(new Date());
    const dias = Math.floor((Date.parse(hoje) - Date.parse(body.dia)) / 86_400_000);
    if (dias < 0 || dias >= DIAS_JANELA) return reply.code(400).send({ detail: `Só dá para conferir os últimos ${DIAS_JANELA} dias` });
    return reply.code(201).send(salvarContagem({ userId: u.sub, ...body }));
  });

  app.get('/api/ajuda/perguntas', { preHandler: [app.authenticate] }, async (request) =>
    perguntasDo((request.user as JwtPayload).sub),
  );

  app.post<{ Params: { id: string } }>('/api/ajuda/perguntas/:id/resposta', { preHandler: [app.authenticate] }, async (request, reply) => {
    const u = request.user as JwtPayload;
    const { opcao } = z.object({ opcao: z.string().min(1).max(80) }).parse(request.body);
    const p = perguntaPorId(request.params.id);
    // Só os dois atletas da luta: pergunta de outra luta responde 404, não 403 (não revela que existe).
    if (!p || (p.atleta_a !== u.sub && p.atleta_b !== u.sub)) return reply.code(404).send({ detail: 'Pergunta não encontrada' });
    if (!responderPergunta(u.sub, p, opcao)) return reply.code(400).send({ detail: 'Opção inválida' });
    return reply.code(201).send({ ok: true, ...resumoAjuda(u.sub) });
  });

  app.get('/api/ajuda/resumo', { preHandler: [app.authenticate] }, async (request) =>
    resumoAjuda((request.user as JwtPayload).sub),
  );

  /* ------------- admin (e, no desenho, o Mac com token de serviço) ------------- */

  /**
   * Desenho para o Mac: busca só o que é novo. Cada tabela tem o seu cursor (`seq` crescente, id estável):
   * GET ?desdeContagem=<n>&desdeCortex=<n>; a resposta traz `proximoContagem` e `proximoCortex` para a próxima busca.
   */
  app.get<{ Querystring: { desdeContagem?: string; desdeCortex?: string } }>('/api/admin/ajuda/respostas', { preHandler: [app.requireAdmin] }, async (request) => {
    const dc = Math.max(0, Number(request.query.desdeContagem ?? 0) || 0);
    const dx = Math.max(0, Number(request.query.desdeCortex ?? 0) || 0);
    const contagem = contagensDesde(dc);
    const cortex = respostasCortexDesde(dx);
    return { contagem, cortex, proximoContagem: contagem.at(-1)?.seq ?? dc, proximoCortex: cortex.at(-1)?.seq ?? dx };
  });

  /** Publicar pergunta (hoje pelo admin; depois o Mac, com o mesmo corpo). Idempotente pelo `id`. */
  app.post('/api/admin/ajuda/perguntas', { preHandler: [app.requireAdmin] }, async (request, reply) => {
    const b = z
      .object({
        id: z.string().min(8).max(64).optional(),
        lutaId: z.string().min(1).max(64),
        atletaA: z.string().min(1),
        atletaB: z.string().min(1),
        focoInicioS: z.number().min(0),
        focoFimS: z.number().min(0),
        contextoS: z.number().int().min(5).max(30).optional(),
        pergunta: z.string().max(200).optional(),
        opcoes: z.array(z.string().min(1).max(80)).min(2).max(6),
      })
      .refine((v) => v.focoFimS - v.focoInicioS >= 3 && v.focoFimS - v.focoInicioS <= 5, { message: 'A janela de foco deve ter de 3 a 5 segundos' })
      .parse(request.body);
    return reply.code(201).send({ id: publicarPergunta(b) });
  });
}
