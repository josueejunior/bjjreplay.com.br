'use client';

import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import {
  Clock,
  Flame,
  Medal,
  Star,
  Sunrise,
  Trophy,
  Video,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useApi } from '@/lib/hooks/useApi';
import { getGamificationStats } from '@/lib/api/endpoints';
import { useAuth } from '@/lib/hooks/useAuth';
import { formatNumber } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { GamificationStats } from '@/types';

const badgeIcons: Record<string, LucideIcon> = {
  flame: Flame,
  sunrise: Sunrise,
  medal: Medal,
  zap: Zap,
  trophy: Trophy,
  star: Star,
};

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString('pt-BR'));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.2, ease: 'easeOut' });
    return controls.stop;
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
}

function LevelRing({ stats }: { stats: GamificationStats }) {
  const progress = Math.min(
    (stats.xp - stats.xpCurrentLevel) / (stats.xpToNextLevel - stats.xpCurrentLevel),
    1
  );
  const R = 42;
  const C = 2 * Math.PI * R;

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff88" />
            <stop offset="100%" stopColor="#00b4d8" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={R} fill="none" stroke="#26262b" strokeWidth="7" />
        <motion.circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - progress) }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
          style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,136,0.45))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
          Nível
        </span>
        <span className="text-2xl font-extrabold text-white">{stats.level}</span>
      </div>
    </div>
  );
}

export function StatsSidebar() {
  const { user } = useAuth();
  const { data: stats, loading } = useApi(getGamificationStats, [user?.id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="skeleton h-40" />
        <div className="skeleton h-48" />
        <div className="skeleton h-36" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Perfil com banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="card-premium top-shine overflow-hidden rounded-2xl border border-zinc-800"
      >
        <div className="h-16 bg-gradient-to-r from-neon/15 via-sky-500/10 to-violet-500/15" />
        <div className="-mt-8 flex flex-col items-center px-5 pb-5">
          {user?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-16 w-16 rounded-full border-2 border-background object-cover ring-2 ring-neon/50"
            />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-background bg-surface-raised text-xl font-bold text-neon ring-2 ring-neon/50">
              {(user?.name ?? 'A')[0].toUpperCase()}
            </span>
          )}
          <p className="mt-2.5 max-w-full truncate font-semibold text-zinc-100">
            {user?.name ?? 'Atleta'}
          </p>
          <p className="text-xs capitalize text-zinc-500">{user?.sportLevel ?? 'iniciante'}</p>
          <div className="mt-2.5 flex items-center gap-2">
            <Badge
              variant={user?.plan === 'free' ? 'zinc' : user?.plan === 'black' ? 'black' : 'premium'}
            >
              {user?.plan === 'free' ? 'Free' : user?.plan === 'black' ? 'Black' : 'Premium'}
            </Badge>
            <Badge variant="neon">
              <Trophy className="h-3 w-3" /> #{stats.weeklyRank}
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Nível com anel radial */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="card-premium flex items-center gap-4 rounded-2xl border border-zinc-800 p-5"
      >
        <LevelRing stats={stats} />
        <div className="min-w-0">
          <p className="font-semibold text-neon">{stats.levelName}</p>
          <p className="mt-1 text-xl font-extrabold text-white">
            <AnimatedNumber value={stats.xp} />
            <span className="ml-1 text-xs font-medium text-zinc-500">XP</span>
          </p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            Faltam{' '}
            <span className="font-medium text-zinc-300">
              {formatNumber(stats.xpToNextLevel - stats.xp)} XP
            </span>{' '}
            para o nível {stats.level + 1}
          </p>
        </div>
      </motion.div>

      {/* Métricas */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.16 }}
        className="grid grid-cols-2 gap-3"
      >
        <MetricCard
          icon={Flame}
          label="Streak"
          value={`${stats.streakDays}`}
          suffix="dias"
          iconClass="text-orange-400"
          glowClass="group-hover:shadow-[0_0_18px_rgba(251,146,60,0.15)]"
        />
        <MetricCard
          icon={Trophy}
          label="Ranking"
          value={`#${stats.weeklyRank}`}
          suffix="semanal"
          iconClass="text-amber-300"
          glowClass="group-hover:shadow-[0_0_18px_rgba(252,211,77,0.15)]"
        />
        <MetricCard
          icon={Video}
          label="Treinos"
          value={String(stats.totalVideos)}
          suffix="vídeos"
          iconClass="text-neon"
          glowClass="group-hover:shadow-glow"
        />
        <MetricCard
          icon={Clock}
          label="Tempo"
          value={formatNumber(stats.totalMinutes)}
          suffix="min"
          iconClass="text-sky-400"
          glowClass="group-hover:shadow-[0_0_18px_rgba(56,189,248,0.15)]"
        />
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.24 }}
        className="card-premium rounded-2xl border border-zinc-800 p-5"
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Conquistas</p>
          <span className="text-xs text-zinc-600">
            {stats.badges.filter((b) => b.earned).length}/{stats.badges.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {stats.badges.map((badge, i) => {
            const Icon = badgeIcons[badge.icon] ?? Star;
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                title={badge.name}
                className={cn(
                  'group flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-all duration-300',
                  badge.earned
                    ? 'border-neon/25 bg-gradient-to-b from-neon/10 to-transparent hover:border-neon/50 hover:shadow-glow'
                    : 'border-zinc-800/80 opacity-35 grayscale'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 transition-transform duration-300 group-hover:scale-110',
                    badge.earned ? 'text-neon' : 'text-zinc-600'
                  )}
                />
                <span className="line-clamp-1 text-center text-[9px] leading-tight text-zinc-400">
                  {badge.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  suffix,
  iconClass,
  glowClass,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  suffix: string;
  iconClass: string;
  glowClass: string;
}) {
  return (
    <div
      className={cn(
        'card-premium group rounded-2xl border border-zinc-800 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-700',
        glowClass
      )}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
        <Icon className={cn('h-4 w-4', iconClass)} />
      </span>
      <p className="mt-3 text-xl font-extrabold leading-none text-white">{value}</p>
      <p className="mt-1 text-[11px] text-zinc-500">
        {label} · {suffix}
      </p>
    </div>
  );
}
