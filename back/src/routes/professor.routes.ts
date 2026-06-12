import type { FastifyInstance } from 'fastify';
import { getBibliotecaByAcademy } from '../services/biblioteca.service.js';
import { findById, findStudentsByAcademy, isProfessor, toPublicUser } from '../services/user.service.js';import type { JwtPayload } from '../plugins/auth.js';

function findStudentInAcademy(academyName: string, alunoId: string) {
  return findStudentsByAcademy(academyName).find((s) => s.id === alunoId);
}

export async function professorRoutes(app: FastifyInstance) {
  app.get(
    '/api/professor/biblioteca',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const payload = request.user as JwtPayload;
      const user = findById(payload.sub);
      if (!user) return reply.code(404).send({ detail: 'Usuário não encontrado' });

      if (!isProfessor(user)) {
        return reply.code(403).send({ detail: 'Acesso restrito a professores' });
      }

      if (!user.academyName) {
        return reply.code(400).send({ detail: 'Professor sem academia vinculada' });
      }

      return getBibliotecaByAcademy(user.academyName);
    }
  );

  app.get(
    '/api/professor/alunos',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const payload = request.user as JwtPayload;
      const user = findById(payload.sub);
      if (!user) return reply.code(404).send({ detail: 'Usuário não encontrado' });

      if (!isProfessor(user)) {
        return reply.code(403).send({ detail: 'Acesso restrito a professores' });
      }

      if (!user.academyName) {
        return reply.code(400).send({ detail: 'Professor sem academia vinculada' });
      }

      return findStudentsByAcademy(user.academyName).map(toPublicUser);
    }
  );

  app.get<{ Params: { alunoId: string } }>(
    '/api/professor/alunos/:alunoId',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const payload = request.user as JwtPayload;
      const user = findById(payload.sub);
      if (!user) return reply.code(404).send({ detail: 'Usuário não encontrado' });

      if (!isProfessor(user)) {
        return reply.code(403).send({ detail: 'Acesso restrito a professores' });
      }

      if (!user.academyName) {
        return reply.code(400).send({ detail: 'Professor sem academia vinculada' });
      }

      const aluno = findStudentInAcademy(user.academyName, request.params.alunoId);
      if (!aluno) {
        return reply.code(404).send({ detail: 'Aluno não encontrado nesta academia' });
      }

      return toPublicUser(aluno);
    }
  );
}
