/** Paleta oficial BJJ Replay — inspirada no kimono, faixa preta e ponteira vermelha */
export const BRAND = {
  white: '#F8FAFC',
  kimonoBlue: '#1E3A8A',
  kimonoBlueLight: '#2563EB',
  kimonoBlueDark: '#0F172A',
  beltBlack: '#0A0A0A',
  /** Vermelho da ponteira da faixa — accent principal */
  ponteiraRed: '#DC2626',
  ponteiraRedBright: '#EF4444',
  ponteiraRedDark: '#B91C1C',
  /** Legado — laranja do escudo antigo */
  shieldOrange: '#F97316',
  shieldOrangeBright: '#FB923C',
  shieldOrangeDark: '#C2410C',
  /** HUD / IA / tracking */
  cyberGreen: '#22FF88',
  cyberGreenDim: '#00CC6A',
} as const;

export const BRAND_GRADIENT = `linear-gradient(135deg, ${BRAND.white} 0%, ${BRAND.kimonoBlueLight} 55%, ${BRAND.cyberGreen} 100%)`;

export const BRAND_WORDMARK = 'BJJ REPLAY';
export const BRAND_TAGLINE = 'Automated Replay & Analysis';
