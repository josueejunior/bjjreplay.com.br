'use client';

import { motion } from 'framer-motion';
import { Flame, Heart, Zap } from 'lucide-react';
import { LandingMedia } from '@/components/landing/LandingMedia';
import { LANDING_MEDIA } from '@/lib/landing/media';

interface GalleryItem {
  image: string;
  label: string;
  meta: string;
}

const rowA: GalleryItem[] = [
  {
    image: LANDING_MEDIA.community.guardPass,
    label: 'Passagem de guarda',
    meta: '+120 XP',
  },
  {
    image: LANDING_MEDIA.community.matTraining,
    label: 'Aquecimento no tatame',
    meta: 'Streak 12 dias',
  },
  {
    image: LANDING_MEDIA.community.competition,
    label: 'Luta de campeonato',
    meta: '+95 XP',
  },
  {
    image: LANDING_MEDIA.community.functional,
    label: 'Rola técnica',
    meta: 'Nível 8',
  },
  {
    image: LANDING_MEDIA.community.gym,
    label: 'Drill no tatame',
    meta: '+60 XP',
  },
  {
    image: LANDING_MEDIA.community.grappling,
    label: 'Grappling intenso',
    meta: 'Top 50 semanal',
  },
];

const rowB: GalleryItem[] = [
  {
    image: LANDING_MEDIA.community.boxing,
    label: 'Sparring no tatame',
    meta: '+140 XP',
  },
  {
    image: LANDING_MEDIA.community.strength,
    label: 'Finalização no tatame',
    meta: 'Badge Atleta',
  },
  {
    image: LANDING_MEDIA.community.sweep,
    label: 'Raspagem no tatame',
    meta: 'Streak 30 dias',
  },
  {
    image: LANDING_MEDIA.community.conditioning,
    label: 'Infantil no tatame',
    meta: '+110 XP',
  },
  {
    image: LANDING_MEDIA.community.kimono,
    label: 'Kimono e faixa',
    meta: 'Nível 15',
  },
  {
    image: LANDING_MEDIA.community.olympic,
    label: 'Pódio IBJJF',
    meta: 'Top 10 semanal',
  },
];

function GalleryCard({ item }: { item: GalleryItem }) {
  return (
    <figure className="group relative h-52 w-72 shrink-0 overflow-hidden rounded-2xl border border-zinc-800 transition-all duration-300 hover:border-neon/40 hover:shadow-glow sm:h-60 sm:w-80">
      <LandingMedia
        src={item.image}
        alt={item.label}
        grayscale
        className="scale-[1.1] object-[center_30%] transition-transform duration-700 group-hover:scale-[1.16]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-14 w-20 bg-gradient-to-tl from-black via-black/80 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
        <span className="text-sm font-semibold text-white">{item.label}</span>
        <span className="flex items-center gap-1 rounded-full border border-neon/30 bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-neon backdrop-blur-sm">
          <Zap className="h-3 w-3" />
          {item.meta}
        </span>
      </figcaption>
      <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] text-zinc-300 backdrop-blur-sm">
        <Heart className="h-3 w-3 fill-red-400 text-red-400" />
        {Math.floor(item.label.length * 37)}
      </span>
    </figure>
  );
}

export function CommunityGallery() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 rounded-full bg-neon/[0.04] blur-3xl" />

      <div className="mx-auto mb-16 max-w-3xl px-5 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-semibold text-red-300">
            <Flame className="h-3.5 w-3.5" />
            Comunidade BJJ Replay
          </span>
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Todo dia alguém <span className="text-neon-gradient">supera um limite</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
            Treinos, rolas e campeonatos de jiu-jitsu — a comunidade BJJ Replay em ação.
          </p>
        </motion.div>
      </div>

      <div className="marquee-paused flex flex-col gap-5 overflow-x-hidden">
        <div className="flex w-max gap-5 animate-marquee">
          {[...rowA, ...rowA].map((item, i) => (
            <GalleryCard key={`a-${item.label}-${i}`} item={item} />
          ))}
        </div>
        <div className="flex w-max gap-5 animate-marquee-reverse">
          {[...rowB, ...rowB].map((item, i) => (
            <GalleryCard key={`b-${item.label}-${i}`} item={item} />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent sm:w-40" />
    </section>
  );
}
