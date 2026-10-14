import type { FastifyInstance } from 'fastify';
import { optionalUser } from '../plugins/auth.js';
import { getById, getFeed, isLockedFor } from '../services/video.service.js';
import type { PlanTier } from '../types.js';

export async function videosRoutes(app: FastifyInstance) {
  // Sem token, o feed é servido como plano Free (modo demonstração)
  app.get('/api/videos/feed', async (request) => {
    const user = await optionalUser(request);
    const plan: PlanTier = user?.plan ?? 'free';
    return await getFeed(plan);
  });

  app.get<{ Params: { id: string } }>('/api/videos/:id', async (request, reply) => {
    const video = await getById(request.params.id);
    if (!video) {
      return reply.code(404).send({ detail: 'Vídeo não encontrado' });
    }

    const user = await optionalUser(request);
    const plan: PlanTier = user?.plan ?? 'free';
    if (isLockedFor(video, plan)) {
      return reply.code(403).send({
        detail: `Este vídeo requer o plano ${video.requiredPlan === 'black' ? 'Black' : 'Premium'}`,
      });
    }

    return { ...video, locked: false };
  });
}
