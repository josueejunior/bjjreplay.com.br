import { badges } from '../data/static.js';
import { config, isSupabaseConfigured } from '../config.js';
import {
  type AlunoRow,
  type CheckinRow,
  type EstatisticaRow,
  type MidiaRow,
  type ModalidadeRow,
  type SessaoRow,
  alunoToPublicUser,
  isPhotoMidia,
  isVideoMidia,
  mapPlano,
  midiaToAdminImage,
  midiaToFoto,
  midiaToVideo,
  sessaoToLuta,
} from '../lib/supabase-mappers.js';
import {
  findAuthUserByEmail,
  supabaseFetch,
  supabaseInsert,
  supabasePatch,
  type SupabaseTable,
} from '../lib/supabase.js';
import type {
  AdminImage,
  AthleteCategory,
  FaixaBelt,
  FotoBiblioteca,
  LutaBiblioteca,
  PlanTier,
  PublicUser,
  SportLevel,
  UserRole,
  Video,
} from '../types.js';
import { cpfDigits, isValidCpf } from '../lib/cpf.js';
import { categoryFromBirthDate } from '../lib/athlete-age.js';

export function supabaseEnabled(): boolean {
  return config.useSupabase && isSupabaseConfigured();
}

async function fetchAll<T>(table: SupabaseTable, query = 'select=*'): Promise<T[]> {
  const { data, error } = await supabaseFetch<T[]>(table, query);
  if (error || !data) return [];
  return data;
}

async function getModalidade(alunoId: string): Promise<ModalidadeRow | null> {
  const rows = await fetchAll<ModalidadeRow>(
    'aluno_modalidades',
    `select=*&aluno_id=eq.${alunoId}&limit=1`,
  );
  return rows[0] ?? null;
}

async function getEmailForAluno(alunoId: string, fallback = ''): Promise<string> {
  const alunos = await fetchAll<AlunoRow>('alunos', `select=id&limit=1000`);
  void alunos;
  const res = await fetch(
    `${config.supabaseUrl}/auth/v1/admin/users/${alunoId}`,
    {
      headers: {
        apikey: config.supabaseServiceKey,
        Authorization: `Bearer ${config.supabaseServiceKey}`,
      },
    },
  );
  if (!res.ok) return fallback;
  const body = (await res.json()) as { email?: string };
  return body.email ?? fallback;
}

export async function findAlunoById(id: string): Promise<PublicUser | null> {
  const rows = await fetchAll<AlunoRow>('alunos', `select=*&id=eq.${id}&limit=1`);
  const aluno = rows[0];
  if (!aluno) return null;
  const modalidade = await getModalidade(id);
  const email = await getEmailForAluno(id, `${id}@bjjreplay.app`);
  return alunoToPublicUser(aluno, email, modalidade);
}

export async function findAlunoByEmail(email: string): Promise<PublicUser | null> {
  const authUser = await findAuthUserByEmail(email);
  if (!authUser) return null;
  return findAlunoById(authUser.id);
}

export async function ensureAluno(authUserId: string, email: string, name?: string): Promise<PublicUser> {
  const existing = await findAlunoById(authUserId);
  if (existing) return existing;

  const displayName = name?.trim() || email.split('@')[0];
  await supabaseInsert('alunos', {
    id: authUserId,
    nome_completo: displayName,
    plano_atual: 'FREE',
    acesso: 'ALUNO',
    is_kids: false,
    peso_kg: null,
    data_cadastro: new Date().toISOString(),
    foto: null,
  });

  await supabaseInsert('aluno_modalidades', {
    aluno_id: authUserId,
    modalidade: 'JIU_JITSU',
    graduacao: 'BRANCA',
    graus: 0,
  });

  return (await findAlunoById(authUserId))!;
}

export async function createAlunoFromSignup(
  authUserId: string,
  email: string,
  name?: string,
): Promise<PublicUser> {
  return ensureAluno(authUserId, email, name);
}

export async function updateAlunoProfile(
  userId: string,
  patch: {
    sportLevel?: SportLevel;
    avatarUrl?: string | null;
    belt?: FaixaBelt;
    degree?: number;
    weightKg?: number | null;
    academyName?: string | null;
    name?: string;
    athleteCategory?: AthleteCategory;
    guardianCpf?: string | null;
    guardianName?: string | null;
    birthDate?: string | null;
  },
): Promise<PublicUser | null> {
  const current = await findAlunoById(userId);
  if (!current) return null;

  if (patch.guardianCpf !== undefined && patch.guardianCpf !== null && !isValidCpf(patch.guardianCpf)) {
    throw new Error('CPF do responsável inválido');
  }

  const alunoPatch: Record<string, unknown> = {};
  if (patch.name) alunoPatch.nome_completo = patch.name;
  if (patch.avatarUrl !== undefined) alunoPatch.foto = patch.avatarUrl;
  if (patch.weightKg !== undefined) alunoPatch.peso_kg = patch.weightKg;
  if (patch.athleteCategory !== undefined || patch.birthDate !== undefined) {
    const cat = patch.birthDate ? categoryFromBirthDate(patch.birthDate) : patch.athleteCategory;
    alunoPatch.is_kids = cat === 'kids';
  }

  if (Object.keys(alunoPatch).length > 0) {
    await supabasePatch('alunos', `id=eq.${userId}`, alunoPatch);
  }

  if (patch.belt !== undefined || patch.degree !== undefined) {
    const modalidade = await getModalidade(userId);
    const graduacao = patch.belt ? patch.belt.toUpperCase() : modalidade?.graduacao;
    if (modalidade?.id) {
      await supabasePatch('aluno_modalidades', `id=eq.${modalidade.id}`, {
        graduacao,
        graus: patch.degree ?? modalidade.graus ?? 0,
      });
    } else {
      await supabaseInsert('aluno_modalidades', {
        aluno_id: userId,
        modalidade: 'JIU_JITSU',
        graduacao: graduacao ?? 'BRANCA',
        graus: patch.degree ?? 0,
      });
    }
  }

  return findAlunoById(userId);
}

export async function findStudentsByAcademy(_academyName: string): Promise<PublicUser[]> {
  const alunos = await fetchAll<AlunoRow>('alunos', 'select=*&acesso=eq.ALUNO');
  const result: PublicUser[] = [];
  for (const aluno of alunos) {
    const modalidade = await getModalidade(aluno.id);
    const email = await getEmailForAluno(aluno.id, `${aluno.id}@bjjreplay.app`);
    result.push(alunoToPublicUser(aluno, email, modalidade));
  }
  return result;
}

export function isProfessor(user: PublicUser): boolean {
  return user.role === 'professor' || user.isAdmin;
}

async function getMidiasForSessao(sessaoId: string): Promise<MidiaRow[]> {
  return fetchAll<MidiaRow>('midias', `select=*&sessao_sparring_id=eq.${sessaoId}`);
}

export async function getBibliotecaByAluno(alunoId: string): Promise<LutaBiblioteca[]> {
  const aluno = await findAlunoById(alunoId);
  const isBlackPlan = aluno?.plan === 'black';
  const sessoes = await fetchAll<SessaoRow>(
    'sessoes_sparring',
    `select=*&or=(aluno_1_id.eq.${alunoId},aluno_2_id.eq.${alunoId})&order=horario_inicio.desc`,
  );

  const lutas: LutaBiblioteca[] = [];
  for (const sessao of sessoes) {
    const midias = await getMidiasForSessao(sessao.id);
    lutas.push(sessaoToLuta(sessao, alunoId, midias, aluno?.name, isBlackPlan));
  }
  return lutas;
}

export async function getBibliotecaByAcademy(_academyName: string): Promise<LutaBiblioteca[]> {
  const alunos = await fetchAll<AlunoRow>('alunos', 'select=*&acesso=eq.ALUNO');
  const all: LutaBiblioteca[] = [];
  for (const aluno of alunos) {
    const items = await getBibliotecaByAluno(aluno.id);
    for (const item of items) {
      all.push({ ...item, aluno_name: aluno.nome_completo, aluno_id: aluno.id });
    }
  }
  return all.sort((a, b) => b.data.localeCompare(a.data));
}

export async function userHasPlanBlack(alunoId: string): Promise<boolean> {
  const user = await findAlunoById(alunoId);
  return user?.plan === 'black';
}

export async function getFotosByAluno(alunoId: string): Promise<FotoBiblioteca[]> {
  const marcacoes = await fetchAll<{ midia_id: string }>(
    'midia_marcacoes',
    `select=midia_id&aluno_id=eq.${alunoId}`,
  );
  const fotos: FotoBiblioteca[] = [];

  for (const m of marcacoes) {
    const rows = await fetchAll<MidiaRow>('midias', `select=*&id=eq.${m.midia_id}&limit=1`);
    const midia = rows[0];
    if (midia && isPhotoMidia(midia)) fotos.push(midiaToFoto(midia, alunoId));
  }

  const directMidias = await fetchAll<MidiaRow>('midias', 'select=*&order=timestamp_criacao.desc');
  for (const midia of directMidias) {
    if (isPhotoMidia(midia)) {
      fotos.push(midiaToFoto(midia, alunoId));
    }
  }

  return fotos;
}

const XP_PER_LEVEL = 400;
const LEVEL_NAMES = [
  'Novato', 'Aquecendo', 'Em Movimento', 'Constante', 'Disciplinado',
  'Atleta Dedicado', 'Competidor', 'Veterano', 'Elite', 'Lenda',
];

function levelName(level: number): string {
  const idx = Math.min(Math.floor((level - 1) / 3), LEVEL_NAMES.length - 1);
  return LEVEL_NAMES[idx]!;
}

export async function getStatsForUser(userId: string) {
  const checkins = await fetchAll<CheckinRow>('checkins', `select=*&aluno_id=eq.${userId}`);
  const sessoes = await fetchAll<SessaoRow>(
    'sessoes_sparring',
    `select=id,duracao_segundos&or=(aluno_1_id.eq.${userId},aluno_2_id.eq.${userId})`,
  );

  let xp = checkins.length * 50 + sessoes.length * 120;
  let totalMinutes = 0;
  const earned: string[] = [];

  for (const sessao of sessoes) {
    totalMinutes += Math.floor((sessao.duracao_segundos ?? 0) / 60);
    const stats = await fetchAll<EstatisticaRow>(
      'estatisticas_biomecanicas',
      `select=*&sessao_sparring_id=eq.${sessao.id}&limit=1`,
    );
    const s = stats[0];
    if (s) {
      xp += (s.total_golpes_conectados ?? 0) * 5 + (s.total_finalizacoes ?? 0) * 40;
      if ((s.total_finalizacoes ?? 0) > 0) earned.push('first-sub');
    }
  }

  if (checkins.length >= 5) earned.push('streak-5');
  if (sessoes.length >= 3) earned.push('videos-3');

  const level = Math.floor(xp / XP_PER_LEVEL) + 1;

  return {
    xp,
    level,
    levelName: levelName(level),
    xpCurrentLevel: (level - 1) * XP_PER_LEVEL,
    xpToNextLevel: level * XP_PER_LEVEL,
    streakDays: Math.min(checkins.length, 30),
    totalVideos: sessoes.length,
    totalMinutes,
    weeklyRank: Math.max(1, 100 - xp / 10),
    badges: badges.map((b) => ({ ...b, earned: earned.includes(b.id) })),
  };
}

export async function getDemoStats() {
  const alunos = await fetchAll<AlunoRow>('alunos', 'select=id&limit=1');
  if (!alunos[0]) return null;
  return getStatsForUser(alunos[0].id);
}

export async function listAdminImages(): Promise<AdminImage[]> {
  const midias = await fetchAll<MidiaRow>('midias', 'select=*&order=timestamp_criacao.desc');
  return midias.filter(isPhotoMidia).map(midiaToAdminImage);
}

export async function categorizeAdminImage(imageId: string, category: string) {
  await supabasePatch('midias', `id=eq.${imageId}`, { tipo_midia: category });
  return { imageId, category, message: `Imagem categorizada como "${category}"` };
}

export async function getVideoFeed(_plan: PlanTier): Promise<Array<Video & { locked: boolean }>> {
  const midias = await fetchAll<MidiaRow>('midias', 'select=*&order=timestamp_criacao.desc');
  return midias
    .filter(isVideoMidia)
    .map((m) => {
      const video = midiaToVideo(m, 'free');
      return { ...video, locked: false };
    });
}

export async function getVideoById(id: string): Promise<Video | undefined> {
  const rows = await fetchAll<MidiaRow>('midias', `select=*&id=eq.${id}&limit=1`);
  const midia = rows[0];
  if (!midia || !isVideoMidia(midia)) return undefined;
  return midiaToVideo(midia);
}

export type { UserRole };
