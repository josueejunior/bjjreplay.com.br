import Fastify from 'fastify';
import cors from '@fastify/cors';
import { ZodError } from 'zod';
import { config } from './config.js';
import authPlugin from './plugins/auth.js';
import { authRoutes } from './routes/auth.routes.js';
import { plansRoutes } from './routes/plans.routes.js';
import { videosRoutes } from './routes/videos.routes.js';
import { gamificationRoutes } from './routes/gamification.routes.js';
import { usersRoutes } from './routes/users.routes.js';
import { adminRoutes } from './routes/admin.routes.js';
import { bibliotecaRoutes } from './routes/biblioteca.routes.js';
import { professorRoutes } from './routes/professor.routes.js';

export function buildApp() {
  const app = Fastify({
    logger: {
      transport:
        process.env.NODE_ENV === 'production'
          ? undefined
          : { target: 'pino-pretty', options: { translateTime: 'HH:MM:ss', ignore: 'pid,hostname' } },
    },
    // Avatares em data URL (comprimidos no front, margem de segurança aqui)
    bodyLimit: 15 * 1024 * 1024,
  });

  app.register(cors, {
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  app.register(authPlugin);

  // Erros de validação Zod → 400 com mensagem amigável
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      const first = error.issues[0];
      return reply.code(400).send({
        detail: first ? `${first.path.join('.')}: ${first.message}` : 'Dados inválidos',
        issues: error.issues,
      });
    }
    app.log.error(error);
    const err = error as { statusCode?: number; message?: string };
    const status = err.statusCode ?? 500;
    return reply.code(status).send({
      detail: status >= 500 ? 'Erro interno do servidor' : err.message ?? 'Erro',
    });
  });

  app.get('/health', async () => ({ status: 'ok', uptime: process.uptime() }));

  app.register(authRoutes);
  app.register(plansRoutes);
  app.register(videosRoutes);
  app.register(gamificationRoutes);
  app.register(usersRoutes);
  app.register(adminRoutes);
  app.register(bibliotecaRoutes);
  app.register(professorRoutes);

  return app;
}
