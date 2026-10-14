import { db, rowToGamification, type GamificationRow } from '../lib/db.js';
import { badges } from '../data/static.js';
import {
  getDemoStats as sbGetDemoStats,
  getStatsForUser as sbGetStatsForUser,
  supabaseEnabled,
} from './supabase-store.service.js';

const XP_PER_LEVEL = 400;

const LEVEL_NAMES = [
  'Novato',
  'Aquecendo',
  'Em Movimento',
  'Constante',
  'Disciplinado',
  'Atleta Dedicado',
  'Competidor',
  'Veterano',
  'Elite',
  'Lenda',
];

const selectByUser = db.prepare('SELECT * FROM gamification WHERE user_id = ?');
const selectDemo = db.prepare(
  'SELECT g.* FROM gamification g JOIN users u ON u.id = g.user_id WHERE u.is_admin = 0 LIMIT 1',
);

function levelName(level: number): string {
  const idx = Math.min(Math.floor((level - 1) / 3), LEVEL_NAMES.length - 1);
  return LEVEL_NAMES[idx]!;
}

function toStats(row: GamificationRow) {
  const profile = rowToGamification(row);
  const level = Math.floor(profile.xp / XP_PER_LEVEL) + 1;

  return {
    xp: profile.xp,
    level,
    levelName: levelName(level),
    xpCurrentLevel: (level - 1) * XP_PER_LEVEL,
    xpToNextLevel: level * XP_PER_LEVEL,
    streakDays: profile.streakDays,
    totalVideos: profile.totalVideos,
    totalMinutes: profile.totalMinutes,
    weeklyRank: profile.weeklyRank,
    badges: badges.map((b) => ({
      ...b,
      earned: profile.earnedBadgeIds.includes(b.id),
    })),
  };
}

export async function getStatsForUser(userId: string) {
  if (supabaseEnabled()) return sbGetStatsForUser(userId);
  const row = selectByUser.get(userId) as GamificationRow | undefined;
  return row ? toStats(row) : null;
}

export async function getDemoStats() {
  if (supabaseEnabled()) return sbGetDemoStats();
  const row = selectDemo.get() as GamificationRow | undefined;
  return row ? toStats(row) : null;
}
