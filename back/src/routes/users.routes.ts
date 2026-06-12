import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { isValidCpf } from '../lib/cpf.js';
import { categoryFromBirthDate } from '../lib/athlete-age.js';
import { toPublicUser, updateProfile } from '../services/user.service.js';
import type { JwtPayload } from '../plugins/auth.js';

const beltSchema = z.enum([
  'branca',
  'azul',
  'roxa',
  'marrom',
  'preta',
  'cinza',
  'amarela',
  'laranja',
  'verde',
]);

const profileSchema = z
  .object({
    sportLevel: z.enum(['iniciante', 'intermediario', 'avancado', 'pro']).optional(),
    avatarUrl: z.string().max(3_000_000).nullable().optional(),
    belt: beltSchema.optional(),
    degree: z.number().int().min(0).max(4).optional(),
    weightKg: z.number().min(15).max(200).nullable().optional(),
    academyName: z.string().min(2).max(120).nullable().optional(),
    name: z.string().min(2).max(80).optional(),
    athleteCategory: z.enum(['adulto', 'kids']).optional(),
    guardianCpf: z.string().nullable().optional(),
    guardianName: z.string().min(2).max(80).nullable().optional(),
    birthDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento inválida')
      .optional(),
  })
  .superRefine((body, ctx) => {
    const category =
      body.athleteCategory ??
      (body.birthDate ? categoryFromBirthDate(body.birthDate) : undefined);

    if (category !== 'kids') return;

    if (!body.guardianCpf || !isValidCpf(body.guardianCpf)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CPF do responsável inválido',
        path: ['guardianCpf'],
      });
    }

    const guardianName = body.guardianName?.trim().replace(/\s+/g, ' ');
    if (!guardianName || guardianName.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Nome completo do pai ou responsável é obrigatório',
        path: ['guardianName'],
      });
    }

    if (body.belt && !['branca', 'cinza', 'amarela', 'laranja', 'verde'].includes(body.belt)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Faixa inválida para atleta kids',
        path: ['belt'],
      });
    }
  });

export async function usersRoutes(app: FastifyInstance) {
  app.post('/api/users/profile', { preHandler: [app.authenticate] }, async (request, reply) => {
    const body = profileSchema.parse(request.body);
    const payload = request.user as JwtPayload;

    try {
      const user = updateProfile(payload.sub, body);
      if (!user) return reply.code(404).send({ detail: 'Usuário não encontrado' });
      return toPublicUser(user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar perfil';
      return reply.code(400).send({ detail: message });
    }
  });
}
