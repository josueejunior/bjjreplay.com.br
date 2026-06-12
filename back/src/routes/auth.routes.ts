import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { verifyPassword } from '../lib/password.js';
import { createUser, findByEmail, findById, toPublicUser } from '../services/user.service.js';
import type { JwtPayload } from '../plugins/auth.js';

const credentialsSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  name: z.string().max(80).optional(),
});

export async function authRoutes(app: FastifyInstance) {
  app.post('/api/auth/signup', async (request, reply) => {
    const body = credentialsSchema.parse(request.body);

    if (findByEmail(body.email)) {
      return reply.code(409).send({ detail: 'Este e-mail já está cadastrado' });
    }

    const user = createUser(body.email, body.password, body.name);
    const accessToken = app.jwt.sign(
      { sub: user.id, email: user.email, isAdmin: user.isAdmin },
      { expiresIn: '7d' }
    );

    return reply.code(201).send({ user: toPublicUser(user), accessToken });
  });

  app.post('/api/auth/login', async (request, reply) => {
    const body = credentialsSchema.pick({ email: true, password: true }).parse(request.body);

    const user = findByEmail(body.email);
    if (!user || !verifyPassword(body.password, user.passwordHash, user.passwordSalt)) {
      return reply.code(401).send({ detail: 'E-mail ou senha incorretos' });
    }

    const accessToken = app.jwt.sign(
      { sub: user.id, email: user.email, isAdmin: user.isAdmin },
      { expiresIn: '7d' }
    );

    return { user: toPublicUser(user), accessToken };
  });

  app.get('/api/auth/me', { preHandler: [app.authenticate] }, async (request, reply) => {
    const payload = request.user as JwtPayload;
    const user = findById(payload.sub);
    if (!user) return reply.code(404).send({ detail: 'Usuário não encontrado' });
    return toPublicUser(user);
  });
}
