'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StepperProps {
  steps: string[];
  current: number;
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <motion.span
                animate={active ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.4 }}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-300',
                  done && 'border-neon bg-neon text-black',
                  active && 'border-neon bg-neon/10 text-neon shadow-glow',
                  !done && !active && 'border-zinc-700 text-zinc-600'
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </motion.span>
              <span
                className={cn(
                  'text-[10px] font-medium uppercase tracking-wide',
                  active ? 'text-neon' : 'text-zinc-600'
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className={cn(
                  'mb-5 h-px w-8 transition-colors duration-500 sm:w-12',
                  done ? 'bg-neon' : 'bg-zinc-800'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
