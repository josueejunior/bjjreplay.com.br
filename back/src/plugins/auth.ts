import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../config.js';
import { verifySupabaseToken } from '../lib/supabase.js';
import { findById } from '../services/user.service.js';
import { supabaseEnabled } from '../services/supabase-store.service.js';
import type { User } from '../types.js';

export interface JwtPayload {
  sub: string;
  email: string;
  isAdmin: boolean;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

async function resolveSupabaseUser(request: FastifyRequest): Promise<JwtPayload | null> {
  const header = request.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;

  const authUser = await verifySupabaseToken(token);
  if (!authUser) return null;

  const profile = await findById(authUser.id);
  return {
    sub: authUser.id,
    email: authUser.email,
    isAdmin: profile?.isAdmin ?? false,
  };
}

/** Resolve o usuário do token, ou null se não autenticado/inválido. */
export async function optionalUser(request: FastifyRequest): Promise<User | null> {
  if (supabaseEnabled()) {
    const payload = await resolveSupabaseUser(request);
    if (!payload) return null;
    return (await findById(payload.sub)) ?? null;
  }

  try {
    const payload = await request.jwtVerify<JwtPayload>();
    return (await findById(payload.sub)) ?? null;
  } catch {
    return null;
  }
}

export default fp(async (app: FastifyInstance) => {
  app.register(jwt, { secret: config.jwtSecret });

  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    if (supabaseEnabled()) {
      const payload = await resolveSupabaseUser(request);
      if (payload) {
        request.user = payload;
        return;
      }
      return reply.code(401).send({ detail: 'Não autenticado' });
    }

    try {
      await request.jwtVerify();
    } catch {
      reply.code(401).send({ detail: 'Não autenticado' });
    }
  });

  app.decorate('requireAdmin', async (request: FastifyRequest, reply: FastifyReply) => {
    if (supabaseEnabled()) {
      const payload = await resolveSupabaseUser(request);
      if (!payload) return reply.code(401).send({ detail: 'Não autenticado' });
      if (!payload.isAdmin) return reply.code(403).send({ detail: 'Acesso restrito a administradores' });
      request.user = payload;
      return;
    }

    try {
      const payload = await request.jwtVerify<JwtPayload>();
      if (!payload.isAdmin) {
        reply.code(403).send({ detail: 'Acesso restrito a administradores' });
      }
    } catch {
      reply.code(401).send({ detail: 'Não autenticado' });
    }
  });
});
