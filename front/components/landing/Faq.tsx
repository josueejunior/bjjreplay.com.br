'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const faqs = [
  {
    question: 'O plano Free é grátis para sempre?',
    answer:
      'Sim. Com o plano Free você acessa 3 vídeos por semana, estatísticas básicas e badges iniciais — sem cartão de crédito. Faça upgrade só quando quiser mais.',
  },
  {
    question: 'Como funciona o sistema de XP e ranking?',
    answer:
      'Cada treino concluído gera XP. Streaks diários multiplicam seus pontos. O ranking semanal zera toda segunda-feira — todo mundo tem chance de chegar ao topo.',
  },
  {
    question: 'Posso assistir aos vídeos no celular?',
    answer:
      'Sim. A plataforma é responsiva e os replays funcionam em qualquer tela. Premium e Black também podem baixar em HD.',
  },
  {
    question: 'O BJJ Replay funciona em qualquer campeonato?',
    answer:
      'Integramos com federações parceiras via boxes nos eventos. A box reconhece atletas cadastrados e entrega o replay automaticamente na biblioteca.',
  },
  {
    question: 'Qual a diferença entre Premium e Black?',
    answer:
      'Premium: vídeos ilimitados, HD e estatísticas avançadas. Black: tudo isso + 4K, análise com IA, acesso antecipado e suporte prioritário.',
  },
  {
    question: 'Posso cancelar quando quiser?',
    answer:
      'Sim, sem multa. Cancelamento em 2 cliques e você mantém o acesso até o fim do período pago.',
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto mb-8 max-w-xl text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Perguntas <span className="text-neon-gradient">frequentes</span>
        </h2>
        <p className="mx-auto mt-3 text-sm text-zinc-400">
          Tudo o que você precisa saber antes de começar.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className={cn(
                'rounded-xl border bg-surface/50 transition-colors duration-200',
                isOpen ? 'border-neon/30' : 'border-zinc-800 hover:border-zinc-700'
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-3 p-4 text-left"
              >
                <span
                  className={cn(
                    'text-sm font-medium leading-snug transition-colors duration-200',
                    isOpen ? 'text-neon' : 'text-zinc-200 group-hover:text-neon'
                  )}
                >
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    'mt-0.5 h-4 w-4 shrink-0 text-zinc-500 transition-all duration-200 group-hover:text-neon',
                    isOpen && 'rotate-180 text-neon'
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-xs leading-relaxed text-zinc-500 sm:text-sm">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
