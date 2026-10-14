export type PlanTier = 'free' | 'premium' | 'black';

export type SportLevel = 'iniciante' | 'intermediario' | 'avancado' | 'pro';

export type FaixaBeltAdult = 'branca' | 'azul' | 'roxa' | 'marrom' | 'preta';
export type FaixaBeltKids = 'branca' | 'cinza' | 'amarela' | 'laranja' | 'verde';
export type FaixaBelt = FaixaBeltAdult | FaixaBeltKids;

export type AthleteCategory = 'adulto' | 'kids';

export type UserRole = 'atleta' | 'professor' | 'admin';

export interface Plan {
  id: PlanTier;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  passwordSalt: string;
  avatarUrl: string | null;
  sportLevel: SportLevel;
  plan: PlanTier;
  isAdmin: boolean;
  createdAt: string;
  belt: FaixaBelt;
  degree: number;
  weightKg: number | null;
  academyName: string | null;
  role: UserRole;
  athleteCategory: AthleteCategory;
  guardianCpf: string | null;
  guardianName: string | null;
  birthDate: string | null;
}

/** Usuário sem campos sensíveis — formato consumido pelo front */
export type PublicUser = Omit<User, 'passwordHash' | 'passwordSalt' | 'createdAt'>;

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  durationSeconds: number;
  orientation: 'vertical' | 'horizontal';
  requiredPlan: PlanTier;
  createdAt: string;
  views: number;
  author: {
    name: string;
    avatarUrl: string;
  };
}

export interface BadgeDef {
  id: string;
  name: string;
  icon: string;
}

export interface GamificationProfile {
  userId: string;
  xp: number;
  streakDays: number;
  totalVideos: number;
  totalMinutes: number;
  weeklyRank: number;
  earnedBadgeIds: string[];
}

export interface AdminImage {
  id: string;
  imageUrl: string;
  uploadedAt: string;
  uploadedBy: string;
  category: string | null;
}

export type LutaStatus = 'PENDENTE' | 'PROCESSANDO' | 'ENTREGUE';

export interface LutaBiblioteca {
  id_luta: number;
  status: LutaStatus;
  url_horizontal?: string;
  url_reels_vertical?: string;
  data: string;
  opponent_name?: string;
  opponent_belt?: FaixaBelt;
  event_name?: string;
  event_city?: string;
  belt_at_fight?: FaixaBelt;
  category?: string;
  aluno_name?: string;
  aluno_id?: string;
}

export interface LutaBibliotecaRow {
  id_luta: number;
  aluno_id: string;
  status: LutaStatus;
  url_horizontal: string | null;
  url_reels_vertical: string | null;
  data: string;
  queued_at: string;
  processing_started_at: string | null;
  include_reels: number;
  opponent_name: string | null;
  opponent_belt: string | null;
  event_name: string | null;
  event_city: string | null;
  belt_at_fight: string | null;
  category: string | null;
}

export interface FotoBiblioteca {
  id_foto: number;
  url: string;
  data: string;
  caption?: string;
  event_name?: string;
  id_luta?: number;
}

export interface FotoBibliotecaRow {
  id_foto: number;
  aluno_id: string;
  url: string;
  data: string;
  caption: string | null;
  event_name: string | null;
  id_luta: number | null;
}

export interface LutaSumidaRelato {
  id: number;
  aluno_id: string;
  aluno_name: string;
  aluno_email: string;
  horario_aprox: string;
  tatame?: string;
  adversario?: string;
  evento?: string;
  observacao?: string;
  created_at: string;
  status: 'pendente' | 'resolvido';
}
