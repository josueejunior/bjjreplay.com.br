'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LandingVideo } from '@/components/landing/LandingVideo';
import { LANDING_MEDIA } from '@/lib/landing/media';

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden pb-12 pt-40 sm:pb-16">
      <div className="absolute inset-0 bg-[url(/images/landing/ai-community-competition.jpg)] bg-cover bg-[center_30%]">
        <LandingVideo
          src={LANDING_MEDIA.heroVideo}
          grayscale
          priority
          className="h-full w-full scale-105 opacity-60"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,15,.6)_0%,rgba(7,9,15,.15)_38%,#050a14_100%)]" />

      <div className="absolute right-4 top-44 z-10 flex items-center gap-2.5 rounded border border-white/10 bg-black/65 px-3.5 py-2 text-sm font-semibold uppercase tracking-[.08em] text-zinc-100 sm:right-8 sm:top-44">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-bjj-red" /> REC · Tatame 1
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8"
      >
        <p className="text-sm font-semibold uppercase tracking-[.14em] text-zinc-300">
          Parnaíba · PI · para academias e atletas
        </p>
        <h1 className="mt-4 font-display text-[3.4rem] font-extrabold uppercase leading-[.92] text-white sm:text-8xl lg:text-[8.5rem]">
          A luta acabou.
          <br />
          <span className="text-bjj-red">O replay já está</span> no seu celular.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-100 sm:text-xl">
          A câmera do tatame reconhece você, corta a sua luta e entrega o vídeo na sua
          biblioteca. Sem pedir arquivo pro professor, sem esperar o fim do evento.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex min-h-[3.25rem] items-center justify-center rounded bg-bjj-red px-8 text-lg font-semibold text-white transition-colors hover:bg-red-800"
          >
            Criar conta grátis
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex min-h-[3.25rem] items-center justify-center rounded border border-zinc-600 px-8 text-lg font-semibold text-white transition-colors hover:border-zinc-300"
          >
            Ver como funciona
          </a>
        </div>
      </motion.div>
    </section>
  );
}
