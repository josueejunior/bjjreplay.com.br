import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { verifyPassword } from '../lib/password.js';
import { supabaseAuthSignIn, supabaseAuthSignUp } from '../lib/supabase.js';
import {
  createUser,
  createUserFromAuth,
  ensureUserProfile,
  findByEmail,
  findById,
  toPublicUser,
} from '../services/user.service.js';
import { supabaseEnabled } from '../services/supabase-store.service.js';
import type { JwtPayload } from '../plugins/auth.js';

const credentialsSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  name: z.string().max(80).optional(),
});

export async function authRoutes(app: FastifyInstance) {
  app.post('/api/auth/signup', async (request, reply) => {
    const body = credentialsSchema.parse(request.body);

    if (supabaseEnabled()) {
      if (await findByEmail(body.email)) {
        return reply.code(409).send({ detail: 'Este e-mail já está cadastrado' });
      }

      const { accessToken, userId, error } = await supabaseAuthSignUp(body.email, body.password, body.name);
      if (error || !userId) {
        return reply.code(400).send({ detail: error ?? 'Falha ao criar conta' });
      }

      const user = await createUserFromAuth(userId, body.email, body.name);
      return reply.code(201).send({
        user: toPublicUser(user),
        accessToken: accessToken ?? '',
      });
    }

    if (await findByEmail(body.email)) {
      return reply.code(409).send({ detail: 'Este e-mail já está cadastrado' });
    }

    const user = await createUser(body.email, body.password, body.name);
    const accessToken = app.jwt.sign(
      { sub: user.id, email: user.email, isAdmin: user.isAdmin },
      { expiresIn: '7d' },
    );

    return reply.code(201).send({ user: toPublicUser(user), accessToken });
  });

  app.post('/api/auth/login', async (request, reply) => {
    const body = credentialsSchema.pick({ email: true, password: true }).parse(request.body);

    if (supabaseEnabled()) {
      const { accessToken, userId, error } = await supabaseAuthSignIn(body.email, body.password);
      if (error || !accessToken || !userId) {
        return reply.code(401).send({ detail: error ?? 'E-mail ou senha incorretos' });
      }

      const user = await ensureUserProfile(userId, body.email);
      return { user: toPublicUser(user), accessToken };
    }

    const user = await findByEmail(body.email);
    if (!user || !verifyPassword(body.password, user.passwordHash, user.passwordSalt)) {
      return reply.code(401).send({ detail: 'E-mail ou senha incorretos' });
    }

    const accessToken = app.jwt.sign(
      { sub: user.id, email: user.email, isAdmin: user.isAdmin },
      { expiresIn: '7d' },
    );

    return { user: toPublicUser(user), accessToken };
  });

  app.get('/api/auth/me', { preHandler: [app.authenticate] }, async (request, reply) => {
    const payload = request.user as JwtPayload;
    const user = await findById(payload.sub);
    if (!user) return reply.code(404).send({ detail: 'Usuário não encontrado' });
    return toPublicUser(user);
  });

  app.post('/api/auth/sync', { preHandler: [app.authenticate] }, async (request) => {
    const payload = request.user as JwtPayload;
    const user = await ensureUserProfile(payload.sub, payload.email);
    return { user: toPublicUser(user) };
  });
}
