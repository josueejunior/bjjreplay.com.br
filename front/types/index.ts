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

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  sportLevel: SportLevel;
  plan: PlanTier;
  isAdmin: boolean;
  /** Faixa BJJ — define cor neon personalizada na UI */
  belt: FaixaBelt;
  /** Grau (listras) 0–4 */
  degree: number;
  /** Peso em kg — categoria de luta */
  weightKg: number | null;
  /** Academia / filiação */
  academyName: string | null;
  role: UserRole;
  /** Adulto ou atleta kids (faixas infantis) */
  athleteCategory: AthleteCategory;
  /** CPF do responsável — obrigatório para kids */
  guardianCpf: string | null;
  /** Nome completo do pai ou responsável — obrigatório para kids */
  guardianName: string | null;
  /** Data de nascimento ISO (YYYY-MM-DD) */
  birthDate: string | null;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  durationSeconds: number;
  orientation: 'vertical' | 'horizontal';
  locked: boolean;
  requiredPlan: PlanTier;
  createdAt: string;
  views: number;
  /** Janela da luta dentro do vídeo (segundos), quando o vídeo traz 1 min antes e depois. */
  inicioLutaS?: number;
  fimLutaS?: number;
  author: {
    name: string;
    avatarUrl: string;
  };
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  earned: boolean;
}

export interface GamificationStats {
  xp: number;
  level: number;
  levelName: string;
  xpToNextLevel: number;
  xpCurrentLevel: number;
  streakDays: number;
  totalVideos: number;
  totalMinutes: number;
  badges: Badge[];
  weeklyRank: number;
}

export interface AdminImage {
  id: string;
  imageUrl: string;
  uploadedAt: string;
  uploadedBy: string;
  category: string | null;
}

export interface CategorizeResponse {
  imageId: string;
  category: string;
  message: string;
}

/** Status do motor assíncrono de renderização (Oficina V8 / FFmpeg) */
export type LutaStatus = 'PENDENTE' | 'PROCESSANDO' | 'ENTREGUE';

/** Item da biblioteca de replays entregue pela API Python */
export interface LutaBiblioteca {
  id_luta: number;
  status: LutaStatus;
  /** Replay horizontal 16:9 — presente quando status = ENTREGUE */
  url_horizontal?: string;
  /** Reels vertical 9:16 — exclusivo plano Black, quando status = ENTREGUE */
  url_reels_vertical?: string;
  data: string;
  /** Metadados do campeonato */
  opponent_name?: string;
  opponent_belt?: FaixaBelt;
  event_name?: string;
  event_city?: string;
  belt_at_fight?: FaixaBelt;
  category?: string;
  /** Onde a luta começa/termina dentro do vídeo (segundos); ausente = abre do início como antes. */
  inicio_luta_s?: number;
  fim_luta_s?: number;
  /** Preenchido no painel do professor */
  aluno_name?: string;
  aluno_id?: string;
}

/** Foto da biblioteca do aluno (eventos, treinos, etc.) */
export interface FotoBiblioteca {
  id_foto: number;
  url: string;
  data: string;
  caption?: string;
  event_name?: string;
  id_luta?: number;
}

export type ChamadoStatus = 'recebido' | 'vendo' | 'resolvido' | 'procurando' | 'encontrada' | 'nao_encontrada';
export type ChamadoTipo = 'erro' | 'luta_nao_encontrada' | 'problema_luta';

export interface Chamado {
  id: string;
  tipo: ChamadoTipo;
  tela: string | null;
  texto: string;
  extra: Record<string, unknown> | null;
  temPrint: boolean;
  status: ChamadoStatus;
  resposta: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ChamadoAdmin extends Chamado {
  atleta: { id: string; nome: string; email: string } | null;
}

export type ResultadoContagem = 'certo' | 'mais' | 'menos';

export interface DiaContagem {
  dia: string;
  encontradas: number;
  resposta: { resultado: ResultadoContagem; quantas: number; horarios: string | null } | null;
}

export interface PerguntaCortex {
  id: string;
  lutaId: string;
  contextoS: number;
  focoInicioS: number;
  focoFimS: number;
  pergunta: string;
  opcoes: string[];
  criadaEm: string;
  respondida: string | null;
}

export interface ResumoAjuda {
  lutasAjudadas: number;
  diasConferidos: number;
}
