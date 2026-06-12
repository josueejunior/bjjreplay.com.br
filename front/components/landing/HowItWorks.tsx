'use client';

import { motion } from 'framer-motion';
import { Trophy, UserPlus, Video } from 'lucide-react';
import { LANDING_MEDIA } from '@/lib/landing/media';
import { LandingMedia } from '@/components/landing/LandingMedia';

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Crie sua conta grátis',
    description:
      'Cadastre-se em menos de 1 minuto, informe sua faixa e monte seu perfil de atleta na plataforma.',
    image: LANDING_MEDIA.steps.signup,
  },
  {
    icon: Video,
    step: '02',
    title: 'Lute no tatame',
    description:
      'A boxe com IA reconhece você na luta, grava o combate e processa o replay automaticamente.',
    image: LANDING_MEDIA.steps.fight,
  },
  {
    icon: Trophy,
    step: '03',
    title: 'Evolua e suba no ranking',
    description:
      'Assista seus replays, analise cada posição e dispute o topo do ranking da sua academia.',
    image: LANDING_MEDIA.steps.ranking,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-sky-500/[0.04] blur-3xl" />

      <div className="mx-auto mb-20 max-w-3xl text-center">
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
          Do cadastro ao pódio em <span className="text-neon-gradient">3 passos</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
          Sem complicação. Você se cadastra hoje e já recebe o replay da sua primeira luta.
        </p>
      </div>

      <div className="relative grid gap-8 md:grid-cols-3">
        <div className="pointer-events-none absolute left-[16%] right-[16%] top-12 hidden h-px bg-gradient-to-r from-neon/40 via-zinc-700 to-neon/40 md:block" />

        {steps.map((step, i) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: i * 0.15, ease: 'easeOut' }}
            className="card-premium top-shine group relative overflow-hidden rounded-2xl border border-zinc-800 text-center transition-all duration-300 hover:-translate-y-1 hover:border-neon/30 hover:shadow-glow"
          >
            <div className="relative h-44 overflow-hidden">
              <LandingMedia
                src={step.image}
                alt={step.title}
                grayscale
                className="scale-[1.12] object-[center_25%] transition-transform duration-700 group-hover:scale-[1.18]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
              <div className="pointer-events-none absolute bottom-0 right-0 h-16 w-24 bg-gradient-to-tl from-surface from-40% via-surface/90 to-transparent" />
              <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-neon/40 bg-black/70 text-xs font-bold text-neon backdrop-blur-sm">
                {step.step}
              </span>
            </div>

            <div className="p-8 pt-2">
              <div className="relative mx-auto -mt-10 mb-4 flex h-16 w-16 items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-neon/25 bg-surface shadow-glow transition-all duration-300 group-hover:shadow-glow-strong">
                  <step.icon className="h-7 w-7 text-neon" />
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-zinc-500">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
