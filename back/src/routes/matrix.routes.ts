import type { FastifyInstance } from 'fastify';
import {
  SUPABASE_TABLES,
  checkSupabaseHealth,
  listTableRows,
  type SupabaseTable,
} from '../lib/supabase.js';
import { isSupabaseConfigured } from '../config.js';

function isValidTable(name: string): name is SupabaseTable {
  return (SUPABASE_TABLES as readonly string[]).includes(name);
}

export async function matrixRoutes(app: FastifyInstance) {
  app.get('/api/health/supabase', async () => {
    const health = await checkSupabaseHealth();
    const okTables = health.tables.filter((t) => t.ok).length;
    return {
      status: health.configured && health.authOk && okTables === SUPABASE_TABLES.length ? 'ok' : 'degraded',
      configured: health.configured,
      authOk: health.authOk,
      tablesOk: okTables,
      tablesTotal: SUPABASE_TABLES.length,
      tables: health.tables,
    };
  });

  app.get('/api/matrix/tables', async (_request, reply) => {
    if (!isSupabaseConfigured()) {
      return reply.code(503).send({ detail: 'Supabase não configurado no servidor' });
    }
    const health = await checkSupabaseHealth();
    return {
      tables: health.tables,
      names: SUPABASE_TABLES,
    };
  });

  app.get<{ Params: { table: string }; Querystring: { limit?: string } }>(
    '/api/matrix/:table',
    async (request, reply) => {
      if (!isSupabaseConfigured()) {
        return reply.code(503).send({ detail: 'Supabase não configurado no servidor' });
      }

      const { table } = request.params;
      if (!isValidTable(table)) {
        return reply.code(404).send({
          detail: `Tabela '${table}' não existe`,
          available: SUPABASE_TABLES,
        });
      }

      const limit = Math.min(Number(request.query.limit ?? 50), 200);
      const { data, error, status } = await listTableRows(table, limit);
      if (error) {
        return reply.code(status).send({ detail: error });
      }
      return { table, rows: data ?? [] };
    },
  );
}
