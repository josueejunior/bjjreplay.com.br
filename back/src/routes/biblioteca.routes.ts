import type { FastifyInstance } from 'fastify';
import { getBibliotecaByAluno, getFotosByAluno } from '../services/biblioteca.service.js';
import { normalizeAcademyName } from '../lib/academy.js';
import { findById, isProfessor } from '../services/user.service.js';
import type { JwtPayload } from '../plugins/auth.js';

function professorCanViewAlunoBiblioteca(professorId: string, alunoId: string): boolean {
  const professor = findById(professorId);
  const aluno = findById(alunoId);
  if (!professor || !aluno || !isProfessor(professor)) return false;
  if (aluno.role !== 'atleta') return false;
  if (!professor.academyName || !aluno.academyName) return false;
  return normalizeAcademyName(professor.academyName) === normalizeAcademyName(aluno.academyName);
}

export async function bibliotecaRoutes(app: FastifyInstance) {
  app.get<{ Params: { alunoId: string } }>(
    '/api/biblioteca/:alunoId',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const payload = request.user as JwtPayload;
      const { alunoId } = request.params;

      const isOwner = payload.sub === alunoId;
      const isAdmin = payload.isAdmin;
      const isAcademyProfessor = professorCanViewAlunoBiblioteca(payload.sub, alunoId);

      if (!isOwner && !isAdmin && !isAcademyProfessor) {
        return reply.code(403).send({ detail: 'Acesso negado à biblioteca de outro aluno' });
      }

      return getBibliotecaByAluno(alunoId);
    }
  );

  app.get<{ Params: { alunoId: string } }>(
    '/api/biblioteca/:alunoId/fotos',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const payload = request.user as JwtPayload;
      const { alunoId } = request.params;

      const isOwner = payload.sub === alunoId;
      const isAdmin = payload.isAdmin;
      const isAcademyProfessor = professorCanViewAlunoBiblioteca(payload.sub, alunoId);

      if (!isOwner && !isAdmin && !isAcademyProfessor) {
        return reply.code(403).send({ detail: 'Acesso negado à biblioteca de outro aluno' });
      }

      return getFotosByAluno(alunoId);
    }
  );
}
