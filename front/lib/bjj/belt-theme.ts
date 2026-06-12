import type { AthleteCategory, FaixaBelt } from '@/types';

export interface BeltTheme {
  label: string;
  primary: string;
  dim: string;
  faint: string;
  glow: string;
  glowStrong: string;
  gradient: string;
  /** Cor da barra da faixa no avatar */
  bar: string;
}

export const BELT_THEMES: Record<FaixaBelt, BeltTheme> = {
  branca: {
    label: 'Branca',
    primary: '#f4f4f5',
    dim: '#d4d4d8',
    faint: 'rgba(244, 244, 245, 0.12)',
    glow: 'rgba(244, 244, 245, 0.22)',
    glowStrong: 'rgba(244, 244, 245, 0.38)',
    gradient: 'linear-gradient(135deg, #ffffff 0%, #d4d4d8 100%)',
    bar: '#fafafa',
  },
  azul: {
    label: 'Azul',
    primary: '#2563EB',
    dim: '#1E3A8A',
    faint: 'rgba(37, 99, 235, 0.14)',
    glow: 'rgba(37, 99, 235, 0.28)',
    glowStrong: 'rgba(37, 99, 235, 0.45)',
    gradient: 'linear-gradient(135deg, #60a5fa 0%, #1e3a8a 100%)',
    bar: '#1E3A8A',
  },
  roxa: {
    label: 'Roxa',
    primary: '#a855f7',
    dim: '#9333ea',
    faint: 'rgba(168, 85, 247, 0.14)',
    glow: 'rgba(168, 85, 247, 0.28)',
    glowStrong: 'rgba(168, 85, 247, 0.45)',
    gradient: 'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)',
    bar: '#a855f7',
  },
  marrom: {
    label: 'Marrom',
    primary: '#d97706',
    dim: '#b45309',
    faint: 'rgba(217, 119, 6, 0.14)',
    glow: 'rgba(217, 119, 6, 0.28)',
    glowStrong: 'rgba(217, 119, 6, 0.42)',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #b45309 100%)',
    bar: '#92400e',
  },
  preta: {
    label: 'Preta',
    primary: '#F8FAFC',
    dim: '#94A3B8',
    faint: 'rgba(220, 38, 38, 0.1)',
    glow: 'rgba(220, 38, 38, 0.28)',
    glowStrong: 'rgba(220, 38, 38, 0.42)',
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #dc2626 100%)',
    bar: '#0A0A0A',
  },
  cinza: {
    label: 'Cinza',
    primary: '#9CA3AF',
    dim: '#6B7280',
    faint: 'rgba(156, 163, 175, 0.16)',
    glow: 'rgba(156, 163, 175, 0.32)',
    glowStrong: 'rgba(156, 163, 175, 0.48)',
    gradient: 'linear-gradient(135deg, #e5e7eb 0%, #6b7280 100%)',
    bar: '#9CA3AF',
  },
  amarela: {
    label: 'Amarela',
    primary: '#EAB308',
    dim: '#CA8A04',
    faint: 'rgba(234, 179, 8, 0.16)',
    glow: 'rgba(234, 179, 8, 0.32)',
    glowStrong: 'rgba(234, 179, 8, 0.48)',
    gradient: 'linear-gradient(135deg, #fde047 0%, #ca8a04 100%)',
    bar: '#EAB308',
  },
  laranja: {
    label: 'Laranja',
    primary: '#F97316',
    dim: '#EA580C',
    faint: 'rgba(249, 115, 22, 0.16)',
    glow: 'rgba(249, 115, 22, 0.32)',
    glowStrong: 'rgba(249, 115, 22, 0.48)',
    gradient: 'linear-gradient(135deg, #fdba74 0%, #ea580c 100%)',
    bar: '#F97316',
  },
  verde: {
    label: 'Verde',
    primary: '#22C55E',
    dim: '#16A34A',
    faint: 'rgba(34, 197, 94, 0.16)',
    glow: 'rgba(34, 197, 94, 0.32)',
    glowStrong: 'rgba(34, 197, 94, 0.48)',
    gradient: 'linear-gradient(135deg, #86efac 0%, #16a34a 100%)',
    bar: '#22C55E',
  },
};

export const FAIXA_ORDER_ADULT: FaixaBelt[] = ['branca', 'azul', 'roxa', 'marrom', 'preta'];
export const FAIXA_ORDER_KIDS: FaixaBelt[] = ['branca', 'cinza', 'amarela', 'laranja', 'verde'];

/** @deprecated use getFaixaOrder */
export const FAIXA_ORDER = FAIXA_ORDER_ADULT;

export function getFaixaOrder(category: AthleteCategory): FaixaBelt[] {
  return category === 'kids' ? FAIXA_ORDER_KIDS : FAIXA_ORDER_ADULT;
}

export function isBeltValidForCategory(belt: FaixaBelt, category: AthleteCategory): boolean {
  return getFaixaOrder(category).includes(belt);
}

export function getBeltTheme(belt: FaixaBelt | undefined | null): BeltTheme {
  return BELT_THEMES[belt ?? 'branca'];
}

export function applyBeltTheme(belt: FaixaBelt | undefined | null) {
  const theme = getBeltTheme(belt);
  const root = document.documentElement;
  root.dataset.belt = belt ?? 'branca';
  root.style.setProperty('--neon', theme.primary);
  root.style.setProperty('--neon-dim', theme.dim);
  root.style.setProperty('--neon-faint', theme.faint);
  root.style.setProperty('--neon-glow', theme.glow);
  root.style.setProperty('--neon-glow-strong', theme.glowStrong);
  root.style.setProperty('--belt-gradient', theme.gradient);
  root.style.setProperty('--belt-bar', theme.bar);
}

export function resetBeltTheme() {
  applyBeltTheme('branca');
}
