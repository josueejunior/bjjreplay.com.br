'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { LandingMedia } from '@/components/landing/LandingMedia';
import { LANDING_MEDIA } from '@/lib/landing/media';

const clips = [
  {
    src: LANDING_MEDIA.videos.roll,
    title: 'Treino no tatame',
    meta: 'Replay automático',
  },
  {
    src: LANDING_MEDIA.videos.grappling,
    title: 'Passagem de guarda',
    meta: 'IA no combate',
  },
  {
    src: LANDING_MEDIA.videos.competition,
    title: 'Luta de campeonato',
    meta: 'Biblioteca na nuvem',
  },
  {
    src: LANDING_MEDIA.videos.features,
    title: 'Seu replay em HD',
    meta: 'Download e compartilhar',
  },
];

export function VideoReel() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Replays em <span className="text-neon-gradient">ação</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400 sm:text-lg">
          Lutas reais capturadas pela boxe — do tatame direto para a sua biblioteca.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {clips.map((clip, i) => (
          <motion.article
            key={clip.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-surface"
          >
            <div className="relative aspect-[9/16] max-h-80 sm:aspect-video sm:max-h-none">
              <LandingMedia
                src={clip.src}
                alt={clip.title}
                grayscale
                className="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="pointer-events-none absolute bottom-0 right-0 h-12 w-16 bg-gradient-to-tl from-black via-black/70 to-transparent" />
              <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-sm font-semibold text-white">{clip.title}</p>
              <p className="mt-0.5 text-xs text-zinc-400">{clip.meta}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
