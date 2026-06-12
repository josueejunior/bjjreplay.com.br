'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Smartphone, Trophy, Video } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { LandingImage } from '@/components/landing/LandingImage';
import { LANDING_MEDIA } from '@/lib/landing/media';

const highlights = [
  { icon: Video, text: 'Replay automático na sua biblioteca' },
  { icon: Trophy, text: 'Ranking e XP a cada luta' },
  { icon: Smartphone, text: 'Assista no celular ou no PC' },
];

export function AuthBrandingPanel() {
  return (
    <aside className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between">
      <LandingImage
        src={LANDING_MEDIA.community.competition}
        alt=""
        grayscale
        priority
        className="absolute inset-0 scale-105 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-bjj-blue-dark/95 via-black/75 to-bjj-blue/80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(220,38,38,0.12),transparent_55%)]" />

      <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14">
        <Link href="/" className="inline-flex w-fit transition-opacity hover:opacity-90">
          <Logo size="md" variant="elevated" />
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-md"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neon/80">
            BJJ Replay
          </p>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white xl:text-4xl">
            Seus replays de luta,{' '}
            <span className="text-neon-gradient">automáticos</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            A box com IA reconhece você no tatame, grava cada luta e entrega o vídeo na nuvem —
            sem esperar processamento.
          </p>

          <ul className="mt-8 space-y-3">
            {highlights.map((item, i) => (
              <motion.li
                key={item.text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-sm"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neon/25 bg-neon/10">
                  <item.icon className="h-4 w-4 text-neon" />
                </span>
                <span className="text-sm text-zinc-300">{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} BJJ Replay · Feito para atletas de jiu-jitsu
        </p>
      </div>
    </aside>
  );
}
