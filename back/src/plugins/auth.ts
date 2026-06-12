import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../config.js';
import { findById } from '../services/user.service.js';
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

/** Resolve o usuário do token, ou null se não autenticado/inválido. */
export async function optionalUser(request: FastifyRequest): Promise<User | null> {
  try {
    const payload = await request.jwtVerify<JwtPayload>();
    return findById(payload.sub) ?? null;
  } catch {
    return null;
  }
}

export default fp(async (app: FastifyInstance) => {
  app.register(jwt, { secret: config.jwtSecret });

  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch {
      reply.code(401).send({ detail: 'Não autenticado' });
    }
  });

  app.decorate('requireAdmin', async (request: FastifyRequest, reply: FastifyReply) => {
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
