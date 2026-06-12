import { api } from './client';
import type {
  AdminImage,
  AthleteCategory,
  CategorizeResponse,
  FotoBiblioteca,
  GamificationStats,
  LutaBiblioteca,
  Plan,
  SportLevel,
  FaixaBelt,
  UserProfile,
  Video,
} from '@/types';

export async function getPlans(): Promise<Plan[]> {
  const { data } = await api.get<Plan[]>('/api/plans');
  return data;
}

export async function getGamificationStats(): Promise<GamificationStats> {
  const { data } = await api.get<GamificationStats>('/api/gamification/stats');
  return data;
}

export async function getAuthMe(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>('/api/auth/me');
  return data;
}

export async function getVideoFeed(): Promise<Video[]> {
  const { data } = await api.get<Video[]>('/api/videos/feed');
  return data;
}

export async function getVideo(id: string): Promise<Video> {
  const { data } = await api.get<Video>(`/api/videos/${id}`);
  return data;
}

export async function updateProfile(payload: {
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
}): Promise<UserProfile> {
  const { data } = await api.post<UserProfile>('/api/users/profile', payload);
  return data;
}

export async function getProfessorBiblioteca(): Promise<LutaBiblioteca[]> {
  const { data } = await api.get<LutaBiblioteca[]>('/api/professor/biblioteca');
  return data;
}

export async function getProfessorAlunos(): Promise<UserProfile[]> {
  const { data } = await api.get<UserProfile[]>('/api/professor/alunos');
  return data;
}

export async function getProfessorAluno(alunoId: string): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>(`/api/professor/alunos/${alunoId}`);
  return data;
}

export async function getAdminImages(): Promise<AdminImage[]> {
  const { data } = await api.get<AdminImage[]>('/api/admin/images');
  return data;
}

export async function categorizeImage(
  imageId: string,
  category: string
): Promise<CategorizeResponse> {
  const { data } = await api.post<CategorizeResponse>('/api/admin/categorize', {
    imageId,
    category,
  });
  return data;
}

/** Biblioteca de replays do aluno — polling enquanto houver PENDENTE/PROCESSANDO */
export async function getBiblioteca(alunoId: string): Promise<LutaBiblioteca[]> {
  const { data } = await api.get<LutaBiblioteca[]>(`/api/biblioteca/${alunoId}`);
  return data;
}

/** Fotos do aluno na biblioteca */
export async function getBibliotecaFotos(alunoId: string): Promise<FotoBiblioteca[]> {
  const { data } = await api.get<FotoBiblioteca[]>(`/api/biblioteca/${alunoId}/fotos`);
  return data;
}
