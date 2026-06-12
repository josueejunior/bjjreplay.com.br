'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LandingVideo } from '@/components/landing/LandingVideo';
import { LANDING_MEDIA } from '@/lib/landing/media';

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden text-center">
      {/* Vídeo de fundo — protagonista */}
      <div className="absolute inset-0">
        <LandingVideo
          src={LANDING_MEDIA.heroVideo}
          grayscale
          priority
          className="h-full w-full scale-105 opacity-70 sm:opacity-75"
        />
      </div>
      {/* Scrim leve — legível sem apagar o movimento */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-background/95" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,10,20,0.55)_100%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 mx-auto w-full max-w-3xl px-5 pt-24 sm:px-8 sm:pt-28"
      >
        <h1 className="text-[2rem] font-extrabold leading-[1.08] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.8)] min-[480px]:text-4xl sm:text-5xl md:text-6xl">
          Seus replays de luta{' '}
          <span className="text-neon-gradient">automáticos</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-100 drop-shadow-[0_1px_12px_rgba(0,0,0,0.9)] sm:mt-6 sm:text-lg md:text-xl">
          A box com IA reconhece você no tatame, grava cada luta e entrega o replay na sua
          biblioteca — direto da nuvem, sem esperar processamento.
        </p>

        <div className="mt-8 sm:mt-10">
          <Link href="/signup" className="inline-block w-full max-w-sm sm:w-auto">
            <Button size="lg" className="h-14 w-full px-10 text-base shadow-[0_0_32px_rgba(220,38,38,0.45)] sm:w-auto">
              Inscreva-se gratuitamente
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.a
        href="#features"
        aria-label="Rolar para funcionalidades"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-zinc-400 transition-colors hover:text-neon"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.a>
    </section>
  );
}
