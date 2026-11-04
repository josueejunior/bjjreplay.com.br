/** Chamados do aluno (reportar erro) e fila do admin. */
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  CHAMADO_STATUS, CHAMADO_TIPOS, atualizarChamado, chamadoPorId, chamadosDo,
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
      const l = atualizarChamado(request.params.id, body as never);
      if (!l) return reply.code(404).send({ detail: 'Chamado não encontrado' });
      return toChamado(l);
    });
}
