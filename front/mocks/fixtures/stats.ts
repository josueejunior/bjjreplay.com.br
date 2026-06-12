import type { GamificationStats } from '@/types';

export const stats: GamificationStats = {
  xp: 0,
  level: 1,
  levelName: 'Novato',
  xpCurrentLevel: 0,
  xpToNextLevel: 400,
  streakDays: 0,
  totalVideos: 0,
  totalMinutes: 0,
  weeklyRank: 999,
  badges: [
    { id: 'b1', name: 'Primeira Semana', icon: 'flame', earned: false },
    { id: 'b2', name: 'Madrugador', icon: 'sunrise', earned: false },
    { id: 'b3', name: 'Maratonista', icon: 'medal', earned: false },
    { id: 'b4', name: 'Streak 30 dias', icon: 'zap', earned: false },
    { id: 'b5', name: 'Top 10 Semanal', icon: 'trophy', earned: false },
    { id: 'b6', name: 'Vídeo Viral', icon: 'star', earned: false },
  ],
};
