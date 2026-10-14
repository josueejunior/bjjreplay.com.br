import type { FastifyInstance } from 'fastify';
import { optionalUser } from '../plugins/auth.js';
import { getDemoStats, getStatsForUser } from '../services/gamification.service.js';

export async function gamificationRoutes(app: FastifyInstance) {
  // Sem token, retorna o perfil demo para a vitrine funcionar
  app.get('/api/gamification/stats', async (request, reply) => {
    const user = await optionalUser(request);
    const stats = user ? await getStatsForUser(user.id) : await getDemoStats();
    if (!stats) {
      return reply.code(404).send({ detail: 'Perfil de gamificação não encontrado' });
    }
    return stats;
  });
}
