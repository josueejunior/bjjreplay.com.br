'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useApi } from '@/lib/hooks/useApi';
import { getPlans } from '@/lib/api/endpoints';
import { cn } from '@/lib/utils/cn';

export function Pricing() {
  const { data: plans, loading } = useApi(getPlans);

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Escolha o seu <span className="text-metallic">nível de jogo</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-400">
          Comece grátis e evolua quando estiver pronto. Sem fidelidade.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-80 animate-pulse rounded-xl border border-zinc-800 bg-surface" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {plans?.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
              className={cn(
                'relative flex flex-col rounded-xl border bg-surface p-5 transition-all duration-300',
                plan.highlighted
                  ? 'border-neon/40 shadow-glow'
                  : 'border-zinc-800 hover:border-zinc-700',
                plan.id === 'black' && 'border-violet-500/30 hover:border-violet-500/50'
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <Badge variant="neon" className="text-[10px]">
                    Mais popular
                  </Badge>
                </span>
              )}
              {plan.id === 'black' && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <Badge variant="black" className="text-[10px]">
                    <Crown className="h-2.5 w-2.5" /> Elite
                  </Badge>
                </span>
              )}

              <h3
                className={cn(
                  'text-base font-semibold',
                  plan.id === 'black' ? 'text-metallic' : 'text-zinc-100'
                )}
              >
                {plan.name}
              </h3>
              <p className="mt-0.5 text-xs text-zinc-500">{plan.description}</p>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-white sm:text-3xl">{plan.priceLabel}</span>
                {plan.price > 0 && <span className="text-xs text-zinc-500">/mês</span>}
              </div>

              <ul className="mt-4 flex flex-1 flex-col gap-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-zinc-400 sm:text-sm">
                    <Check
                      className={cn(
                        'mt-0.5 h-3.5 w-3.5 shrink-0',
                        plan.id === 'black' ? 'text-violet-400' : 'text-neon'
                      )}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href={`/signup?plan=${plan.id}`} className="mt-5">
                <Button
                  size="sm"
                  variant={plan.highlighted ? 'primary' : plan.id === 'black' ? 'metallic' : 'secondary'}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
