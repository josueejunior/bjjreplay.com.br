import type { FastifyInstance } from 'fastify';
import { getBibliotecaByAluno, getFotosByAluno, relatarLutaSumida, getLutasSumidas } from '../services/biblioteca.service.js';
import { normalizeAcademyName } from '../lib/academy.js';
import { findById, isProfessor } from '../services/user.service.js';
import { supabaseEnabled } from '../services/supabase-store.service.js';
import type { JwtPayload } from '../plugins/auth.js';
import type { LutaSumidaRelato } from '../types.js';

async function professorCanViewAlunoBiblioteca(professorId: string, alunoId: string): Promise<boolean> {
  const professor = await findById(professorId);
  const aluno = await findById(alunoId);
  if (!professor || !aluno || !isProfessor(professor)) return false;
  if (aluno.role !== 'atleta') return false;
  if (supabaseEnabled()) return true;
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
      const isAcademyProfessor = await professorCanViewAlunoBiblioteca(payload.sub, alunoId);

      if (!isOwner && !isAdmin && !isAcademyProfessor) {
        return reply.code(403).send({ detail: 'Acesso negado à biblioteca de outro aluno' });
      }

      return getBibliotecaByAluno(alunoId);
    },
  );

  app.get<{ Params: { alunoId: string } }>(
    '/api/biblioteca/:alunoId/fotos',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const payload = request.user as JwtPayload;
      const { alunoId } = request.params;

      const isOwner = payload.sub === alunoId;
      const isAdmin = payload.isAdmin;
      const isAcademyProfessor = await professorCanViewAlunoBiblioteca(payload.sub, alunoId);

      if (!isOwner && !isAdmin && !isAcademyProfessor) {
        return reply.code(403).send({ detail: 'Acesso negado à biblioteca de outro aluno' });
      }

      return getFotosByAluno(alunoId);
    },
  );

  // Relatar luta que não apareceu
  app.post<{
    Body: {
      horario_aprox: string;
      tatame?: string;
      adversario?: string;
      evento?: string;
      observacao?: string;
    };
  }>(
    '/api/biblioteca/relatar-luta-sumida',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const payload = request.user as JwtPayload;
      const user = await findById(payload.sub);
      if (!user) {
        return reply.code(401).send({ detail: 'Usuário não encontrado' });
      }

      const { horario_aprox, tatame, adversario, evento, observacao } = request.body;
      if (!horario_aprox) {
        return reply.code(400).send({ detail: 'Horário aproximado é obrigatório' });
      }

      const relato = await relatarLutaSumida({
        aluno_id: user.id,
        aluno_name: user.name,
        aluno_email: user.email,
        horario_aprox,
        tatame,
        adversario,
        evento,
        observacao,
      });

      return { success: true, relato };
    },
  );

  // Listar relatos de lutas sumidas (admin)
  app.get(
    '/api/biblioteca/lutas-sumidas',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const payload = request.user as JwtPayload;
      if (!payload.isAdmin) {
        return reply.code(403).send({ detail: 'Acesso restrito a administradores' });
      }
      return getLutasSumidas();
    },
  );
}
