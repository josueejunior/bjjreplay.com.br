'use client';

import { motion } from 'framer-motion';
import { BrainCircuit, Clock, Loader2 } from 'lucide-react';
import { lutaStatusDescription, lutaStatusLabel } from '@/lib/biblioteca/status';
import { cn } from '@/lib/utils/cn';
import type { LutaStatus } from '@/types';

interface ProcessingStatusProps {
  status: LutaStatus;
  compact?: boolean;
  className?: string;
}

export function ProcessingStatus({ status, compact = false, className }: ProcessingStatusProps) {
  const isPending = status === 'PENDENTE';
  const Icon = isPending ? Clock : Loader2;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'gap-3 p-6' : 'gap-5 p-10',
        className
      )}
    >
      <div className="relative">
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className={cn(
            'absolute inset-0 rounded-full blur-xl',
            isPending ? 'bg-amber-400/20' : 'bg-neon/25'
          )}
        />
        <span
          className={cn(
            'relative flex items-center justify-center rounded-full border backdrop-blur-sm',
            compact ? 'h-14 w-14' : 'h-20 w-20',
            isPending
              ? 'border-amber-400/40 bg-amber-400/10'
              : 'border-neon/40 bg-neon/10 shadow-glow'
          )}
        >
          <Icon
            className={cn(
              compact ? 'h-6 w-6' : 'h-8 w-8',
              isPending ? 'text-amber-300' : 'animate-spin text-neon'
            )}
          />
        </span>
      </div>

      <div className="max-w-xs">
        <p
          className={cn(
            'font-bold text-white',
            compact ? 'text-sm' : 'text-lg'
          )}
        >
          {isPending ? 'Aguardando processamento' : 'Renderizando / Analisando IA…'}
        </p>
        <p className={cn('mt-1.5 text-zinc-400', compact ? 'text-xs' : 'text-sm')}>
          {lutaStatusDescription(status)}
        </p>
      </div>

      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold',
          isPending
            ? 'border-amber-400/30 bg-amber-400/10 text-amber-300'
            : 'border-neon/30 bg-neon/10 text-neon'
        )}
      >
        {!isPending && <BrainCircuit className="h-3.5 w-3.5" />}
        {lutaStatusLabel(status)}
      </span>
    </div>
  );
}
