import type {
  AdminImage,
  FaixaBelt,
  FotoBiblioteca,
  LutaBiblioteca,
  LutaStatus,
  PlanTier,
  PublicUser,
  SportLevel,
  UserRole,
  Video,
} from '../types.js';

export interface AlunoRow {
  id: string;
  nome_completo: string;
  plano_atual: string;
  acesso: string;
  is_kids: boolean | null;
  responsavel_id: string | null;
  peso_kg: number | null;
  data_cadastro: string | null;
  foto: string | null;
  sexo: string | null;
}

export interface ModalidadeRow {
  id: string;
  aluno_id: string;
  modalidade: string;
  graduacao: string | null;
  graus: number | null;
  data_graduacao: string | null;
}

export interface SessaoRow {
  id: string;
  treino_id: string | null;
  aluno_1_id: string | null;
  aluno_2_id: string | null;
  horario_inicio: string | null;
  horario_fim: string | null;
  duracao_segundos: number | null;
  status_processamento: string | null;
}

export interface MidiaRow {
  id: string;
  tipo_midia: string | null;
  sessao_sparring_id: string | null;
  treino_id: string | null;
  url_nuvem: string | null;
  dimensao: string | null;
  timestamp_criacao: string | null;
}

export interface CheckinRow {
  id: string;
  aluno_id: string;
  timestamp_entrada: string | null;
}

export interface EstatisticaRow {
  sessao_sparring_id: string;
  total_quedas: number | null;
  total_finalizacoes: number | null;
  total_golpes_conectados: number | null;
  total_esquivas: number | null;
  dominancia_porcentagem: number | null;
}

const GRADUACAO_MAP: Record<string, FaixaBelt> = {
  BRANCA: 'branca',
  AZUL: 'azul',
  ROXA: 'roxa',
  MARROM: 'marrom',
  PRETA: 'preta',
  CINZA: 'cinza',
  AMARELA: 'amarela',
  LARANJA: 'laranja',
  VERDE: 'verde',
};

export function mapPlano(plano: string | null | undefined): PlanTier {
  const p = (plano ?? 'FREE').toUpperCase();
  if (p.includes('BLACK')) return 'black';
  if (p.includes('PREMIUM')) return 'premium';
  return 'free';
}

export function mapAcesso(acesso: string | null | undefined): { role: UserRole; isAdmin: boolean } {
  const a = (acesso ?? 'ALUNO').toUpperCase();
  if (a === 'ADMIN') return { role: 'admin', isAdmin: true };
  if (a === 'PROFESSOR') return { role: 'professor', isAdmin: false };
  return { role: 'atleta', isAdmin: false };
}

export function mapGraduacao(graduacao: string | null | undefined): FaixaBelt {
  if (!graduacao) return 'branca';
  return GRADUACAO_MAP[graduacao.toUpperCase()] ?? 'branca';
}

export function mapSessaoStatus(status: string | null | undefined): LutaStatus {
  const s = (status ?? 'PENDENTE').toUpperCase();
  if (s.includes('ENTREG') || s.includes('CONCLU') || s.includes('FINAL') || s.includes('DONE')) {
    return 'ENTREGUE';
  }
  if (s.includes('PROCESS')) return 'PROCESSANDO';
  return 'PENDENTE';
}

export function uuidToLutaId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

export function alunoToPublicUser(
  aluno: AlunoRow,
  email: string,
  modalidade?: ModalidadeRow | null,
): PublicUser {
  const { role, isAdmin } = mapAcesso(aluno.acesso);
  return {
    id: aluno.id,
    email,
    name: aluno.nome_completo,
    avatarUrl: aluno.foto,
    sportLevel: 'iniciante' as SportLevel,
    plan: mapPlano(aluno.plano_atual),
    isAdmin,
    belt: mapGraduacao(modalidade?.graduacao),
    degree: modalidade?.graus ?? 0,
    weightKg: aluno.peso_kg,
    academyName: null,
    role,
    athleteCategory: aluno.is_kids ? 'kids' : 'adulto',
    guardianCpf: null,
    guardianName: null,
    birthDate: null,
  };
}

export function sessaoToLuta(
  sessao: SessaoRow,
  alunoId: string,
  midias: MidiaRow[],
  alunoName?: string,
  isBlackPlan = false,
): LutaBiblioteca {
  const status = mapSessaoStatus(sessao.status_processamento);
  const horizontal = midias.find((m) => (m.dimensao ?? '').toLowerCase().includes('horizontal'));
  const vertical = midias.find((m) => (m.dimensao ?? '').toLowerCase().includes('vertical'));

  const item: LutaBiblioteca = {
    id_luta: uuidToLutaId(sessao.id),
    status,
    data: (sessao.horario_inicio ?? sessao.horario_fim ?? new Date().toISOString()).slice(0, 10),
    aluno_id: alunoId,
    aluno_name: alunoName,
  };

  if (status === 'ENTREGUE') {
    if (horizontal?.url_nuvem) item.url_horizontal = horizontal.url_nuvem;
    if (isBlackPlan && vertical?.url_nuvem) item.url_reels_vertical = vertical.url_nuvem;
  }

  return item;
}

export function midiaToFoto(midia: MidiaRow, alunoId: string): FotoBiblioteca {
  return {
    id_foto: uuidToLutaId(midia.id),
    url: midia.url_nuvem ?? '',
    data: (midia.timestamp_criacao ?? new Date().toISOString()).slice(0, 10),
    id_luta: midia.sessao_sparring_id ? uuidToLutaId(midia.sessao_sparring_id) : undefined,
  };
}

export function midiaToVideo(midia: MidiaRow, plan: PlanTier = 'free'): Video {
  const id = midia.id;
  return {
    id,
    title: midia.tipo_midia ?? 'Replay BJJ',
    description: 'Vídeo da biblioteca BJJ Replay Matrix',
    thumbnailUrl: midia.url_nuvem ?? '',
    videoUrl: midia.url_nuvem ?? '',
    durationSeconds: 120,
    orientation: (midia.dimensao ?? '').toLowerCase().includes('vertical') ? 'vertical' : 'horizontal',
    requiredPlan: plan,
    createdAt: midia.timestamp_criacao ?? new Date().toISOString(),
    views: 0,
    author: { name: 'BJJ Replay', avatarUrl: '' },
  };
}

export function midiaToAdminImage(midia: MidiaRow): AdminImage {
  return {
    id: midia.id,
    imageUrl: midia.url_nuvem ?? '',
    uploadedAt: midia.timestamp_criacao ?? new Date().toISOString(),
    uploadedBy: 'matrix',
    category: null,
  };
}

export function isPhotoMidia(midia: MidiaRow): boolean {
  const t = (midia.tipo_midia ?? '').toUpperCase();
  return t.includes('FOTO') || t.includes('IMAGE') || t.includes('IMAGEM');
}

export function isVideoMidia(midia: MidiaRow): boolean {
  const t = (midia.tipo_midia ?? '').toUpperCase();
  return t.includes('VIDEO') || t.includes('REPLAY') || t.includes('SPARRING') || !!midia.url_nuvem?.includes('.mp4');
}
