import type { FastifyInstance } from 'fastify';
import { plans } from '../data/static.js';

export async function plansRoutes(app: FastifyInstance) {
  app.get('/api/plans', async () => plans);
}
