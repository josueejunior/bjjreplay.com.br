'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  Check,
  Crown,
  Download,
  Flame,
  Medal,
  Play,
  Star,
  Sunrise,
  Trophy,
  Video,
  Zap,
} from 'lucide-react';
import { LANDING_MEDIA } from '@/lib/landing/media';
import { LandingMedia } from '@/components/landing/LandingMedia';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

const chartBars = [38, 55, 42, 70, 58, 85, 96];

const leaderboard = [
  { pos: 1, name: 'Diego F.', xp: '2.340', img: 12, accent: 'text-amber-300' },
  { pos: 2, name: 'Você', xp: '2.180', img: 15, accent: 'text-neon', you: true },
  { pos: 3, name: 'Paula R.', xp: '1.950', img: 32, accent: 'text-zinc-400' },
];

const miniBadges = [
  { icon: Flame, earned: true },
  { icon: Sunrise, earned: true },
  { icon: Medal, earned: true },
  { icon: Zap, earned: true },
  { icon: Trophy, earned: false },
  { icon: Star, earned: false },
];

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden py-28 sm:py-36">
      {/* Textura leve de fundo — foto estática em vez de vídeo */}
      <div className="pointer-events-none absolute inset-0">
        <LandingMedia
          src={LANDING_MEDIA.videos.grappling}
          alt=""
          grayscale
          className="h-full w-full opacity-[0.18] sm:opacity-[0.22]"
        />
        <div className="absolute inset-0 bg-background/88" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
      <div className="pointer-events-none absolute left-0 top-1/3 h-72 w-72 rounded-full bg-neon/[0.04] blur-3xl" />

      <div className="mx-auto mb-20 max-w-3xl text-center">
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
          Feito para quem <span className="text-neon-gradient">compete consigo mesmo</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
          Tudo o que você precisa para transformar disciplina em resultado, em um só lugar.
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Vídeos exclusivos — card grande com preview */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="card-premium top-shine group relative overflow-hidden rounded-3xl border border-zinc-800 transition-all duration-300 hover:-translate-y-1 hover:border-neon/30 hover:shadow-glow lg:col-span-2"
        >
          <div className="relative h-64 overflow-hidden sm:h-72">
            <LandingMedia
              src={LANDING_MEDIA.featuresPreview}
              alt="Replays automáticos"
              grayscale
              className="transition-transform duration-700 group-hover:scale-[1.05]"
            />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-surface via-surface/30 to-transparent" />

            {/* Play central — acima do gradiente, alto contraste */}
            <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neon shadow-[0_0_28px_rgba(220,38,38,0.55)] ring-2 ring-white/25 transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-1 h-7 w-7 fill-white text-white" />
            </span>

            {/* Chip de duração */}
            <span className="absolute right-4 top-4 rounded-md border border-white/10 bg-black/80 px-2 py-1 text-xs font-medium text-zinc-200 backdrop-blur-sm">
              15:12
            </span>
            {/* Chip XP flutuante */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-neon/30 bg-black/80 px-3 py-1.5 text-xs font-semibold text-neon backdrop-blur-sm"
            >
              <Zap className="h-3.5 w-3.5" /> +120 XP ao concluir
            </motion.span>
          </div>

          <div className="p-7">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-neon/10">
              <Video className="h-5 w-5 text-neon" />
            </span>
            <h3 className="text-xl font-bold text-white">Replays automáticos</h3>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400">
              A IA reconhece você no tatame, grava cada luta e entrega o replay na sua biblioteca —
              passagem de guarda, raspagem, finalização e muito mais.
            </p>
          </div>
        </motion.div>

        {/* Streaks e XP — com visual de progresso */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="card-premium top-shine group flex flex-col rounded-3xl border border-zinc-800 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:shadow-[0_0_24px_rgba(220,38,38,0.12)]"
        >
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
            <Flame className="h-5 w-5 text-red-400" />
          </span>
          <h3 className="text-xl font-bold text-white">Streaks e XP</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Treine todo dia, mantenha a sequência viva e multiplique seus ganhos.
          </p>

          {/* Mini visual: dias da semana + barra de XP */}
          <div className="mt-auto pt-6">
            <div className="flex justify-between">
              {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.3 }}
                  className={
                    i < 5
                      ? 'flex h-9 w-9 items-center justify-center rounded-full border border-red-500/40 bg-red-500/15 text-xs font-bold text-red-300'
                      : 'flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 text-xs font-medium text-zinc-600'
                  }
                >
                  {i < 5 ? <Flame className="h-4 w-4" /> : day}
                </motion.span>
              ))}
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-800">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '72%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400"
              />
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              <span className="font-semibold text-red-300">Streak de 5 dias</span> · +72 XP
              hoje
            </p>
          </div>
        </motion.div>

        {/* Estatísticas — mini gráfico de barras */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="card-premium top-shine group flex flex-col rounded-3xl border border-zinc-800 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/30 hover:shadow-[0_0_24px_rgba(56,189,248,0.12)]"
        >
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-400/10">
            <BarChart3 className="h-5 w-5 text-sky-400" />
          </span>
          <h3 className="text-xl font-bold text-white">Estatísticas avançadas</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Métricas de tempo, frequência e intensidade para enxergar sua evolução.
          </p>

          {/* Mini gráfico animado */}
          <div className="mt-auto flex h-24 items-end justify-between gap-2 pt-6">
            {chartBars.map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${height}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: 'easeOut' }}
                className={
                  i === chartBars.length - 1
                    ? 'w-full rounded-t-md bg-gradient-to-t from-sky-500 to-neon'
                    : 'w-full rounded-t-md bg-sky-400/25'
                }
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            <span className="font-semibold text-sky-300">+96% de volume</span> esta semana
          </p>
        </motion.div>

        {/* Ranking — mini leaderboard */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="card-premium top-shine group flex flex-col rounded-3xl border border-zinc-800 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:shadow-[0_0_24px_rgba(252,211,77,0.12)]"
        >
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10">
            <Trophy className="h-5 w-5 text-amber-300" />
          </span>
          <h3 className="text-xl font-bold text-white">Ranking competitivo</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Dispute o topo semanal contra a comunidade. Toda segunda recomeça.
          </p>

          {/* Mini leaderboard */}
          <div className="mt-auto flex flex-col gap-2 pt-6">
            {leaderboard.map((row, i) => (
              <motion.div
                key={row.pos}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
                className={
                  row.you
                    ? 'flex items-center gap-3 rounded-xl border border-neon/35 bg-neon/[0.07] px-3 py-2'
                    : 'flex items-center gap-3 rounded-xl border border-zinc-800/80 px-3 py-2'
                }
              >
                <span className={`w-4 text-xs font-bold ${row.accent}`}>{row.pos}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.pravatar.cc/48?img=${row.img}`}
                  alt={row.name}
                  className="h-6 w-6 rounded-full"
                />
                <span
                  className={
                    row.you
                      ? 'flex-1 truncate text-xs font-bold text-neon'
                      : 'flex-1 truncate text-xs font-medium text-zinc-300'
                  }
                >
                  {row.name}
                </span>
                <span className="text-[11px] text-zinc-500">{row.xp} XP</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Badges — grade de conquistas */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          className="card-premium top-shine group flex flex-col rounded-3xl border border-zinc-800 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-[0_0_24px_rgba(167,139,250,0.12)]"
        >
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-400/10">
            <Medal className="h-5 w-5 text-violet-400" />
          </span>
          <h3 className="text-xl font-bold text-white">Badges e conquistas</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Desbloqueie conquistas a cada marco: primeira semana, maratonista, madrugador…
          </p>

          {/* Mini grid de badges */}
          <div className="mt-auto grid grid-cols-6 gap-2 pt-6">
            {miniBadges.map((badge, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.09, duration: 0.4, type: 'spring' }}
                className={
                  badge.earned
                    ? 'flex aspect-square items-center justify-center rounded-xl border border-violet-400/35 bg-gradient-to-b from-violet-400/15 to-transparent'
                    : 'flex aspect-square items-center justify-center rounded-xl border border-zinc-800 opacity-35 grayscale'
                }
              >
                <badge.icon
                  className={badge.earned ? 'h-4 w-4 text-violet-300' : 'h-4 w-4 text-zinc-600'}
                />
              </motion.span>
            ))}
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            <span className="font-semibold text-violet-300">4 de 6</span> conquistas desbloqueadas
          </p>
        </motion.div>

        {/* Downloads — faixa horizontal full-width */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="card-premium top-shine group flex flex-col gap-6 rounded-3xl border border-zinc-800 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:shadow-[0_0_24px_rgba(52,211,153,0.12)] sm:flex-row sm:items-center lg:col-span-3"
        >
          <div className="flex items-start gap-5 sm:flex-1">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
              <Download className="h-5 w-5 text-emerald-400" />
            </span>
            <div>
              <h3 className="text-xl font-bold text-white">Downloads em HD e 4K</h3>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-zinc-400">
                Baixe os treinos para assistir offline, onde estiver — na academia, na trilha ou
                em viagem.
              </p>
            </div>
          </div>

          {/* Pills de qualidade por plano */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 rounded-full border border-zinc-700 bg-surface-raised px-4 py-2 text-xs font-semibold text-zinc-300">
              <Check className="h-3.5 w-3.5 text-emerald-400" /> HD · Premium
            </span>
            <span className="flex items-center gap-2 rounded-full border border-violet-400/35 bg-violet-400/10 px-4 py-2 text-xs font-semibold text-violet-300">
              <Crown className="h-3.5 w-3.5" /> 4K + IA · Black
            </span>
          </div>
        </motion.div>
      </div>
      </div>
    </section>
  );
}
