'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const testimonials = [
  {
    name: 'Mariana Castro',
    role: 'Faixa roxa · São Paulo',
    avatar: 'https://i.pravatar.cc/100?img=47',
    plan: 'Premium',
    text: 'Em 3 meses minha guarda evoluiu demais. O replay automático me mostrou erros que o professor falava e eu não via. O streak virou vício saudável.',
  },
  {
    name: 'Diego Fernandes',
    role: 'Competidor · Rio de Janeiro',
    avatar: 'https://i.pravatar.cc/100?img=12',
    plan: 'Black',
    text: 'A análise com IA do plano Black é surreal. Corrigi detalhes na passagem de guarda e subi no pódio no estadual. Vale cada centavo.',
  },
  {
    name: 'Paula Ribeiro',
    role: 'Faixa azul · Curitiba',
    avatar: 'https://i.pravatar.cc/100?img=32',
    plan: 'Premium',
    text: 'Nunca mais perdi um replay de campeonato. E brigar pelo top 50 do ranking semanal com os parceiros de treino virou o esporte dentro do esporte.',
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="pointer-events-none absolute right-0 top-1/4 h-48 w-48 rounded-full bg-violet-500/[0.04] blur-3xl" />

      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Quem luta com o BJJ Replay <span className="text-metallic">nunca perde o replay</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-400">
          Histórias reais de atletas que transformaram a disciplina em resultado.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
            className="card-premium top-shine flex flex-col rounded-xl border border-zinc-800 p-4 transition-all duration-300 hover:border-neon/25 hover:shadow-glow sm:p-5"
          >
            <div className="mb-2.5 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <blockquote className="line-clamp-4 flex-1 text-xs leading-relaxed text-zinc-400 sm:text-sm">
              &ldquo;{t.text}&rdquo;
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-2.5 border-t border-zinc-800/70 pt-3.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.avatar}
                alt={t.name}
                className="h-8 w-8 rounded-full object-cover ring-1 ring-neon/30"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">{t.name}</p>
                <p className="truncate text-[11px] text-zinc-500">{t.role}</p>
              </div>
              <Badge variant={t.plan === 'Black' ? 'black' : 'premium'} className="text-[10px]">
                {t.plan}
              </Badge>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
