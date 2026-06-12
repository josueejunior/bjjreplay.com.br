'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { LandingMedia } from '@/components/landing/LandingMedia';
import { LANDING_MEDIA } from '@/lib/landing/media';

export function CtaFinal() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-28 sm:px-8 sm:pb-36">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="top-shine relative overflow-hidden rounded-3xl border border-neon/25 px-6 py-20 text-center sm:px-12 sm:py-24"
      >
        <LandingMedia
          src={LANDING_MEDIA.ctaBackground}
          alt=""
          grayscale
          className="absolute inset-0 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-bjj-blue/50 via-black/70 to-bjj-blue-dark/85" />

        {/* Glow decorativo */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[500px] -translate-x-1/2 rounded-full bg-neon/10 blur-3xl" />

        <div className="relative">
        <div className="mx-auto mb-6 flex justify-center">
          <Logo size="lg" variant="elevated" />
        </div>

        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
          Seu replay começa com <span className="text-neon-gradient">um cadastro</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-zinc-400 sm:text-lg">
          Cadastre-se antes do campeonato. A boxe reconhece você na luta e entrega o vídeo na
          biblioteca — automaticamente.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto">
              Criar conta grátis <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#pricing">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Comparar planos
            </Button>
          </a>
        </div>

        <p className="mt-6 text-xs text-zinc-500">
          Free para sempre · Upgrade quando quiser · Cancele em 2 cliques
        </p>
        </div>
      </motion.div>
    </section>
  );
}
