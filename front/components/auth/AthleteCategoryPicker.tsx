'use client';

import { motion } from 'framer-motion';
import { Baby, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { AthleteCategory } from '@/types';

interface AthleteCategoryPickerProps {
  value: AthleteCategory;
  onChange: (category: AthleteCategory) => void;
}

export function AthleteCategoryPicker({ value, onChange }: AthleteCategoryPickerProps) {
  const options: { id: AthleteCategory; label: string; hint: string; icon: typeof UserRound }[] = [
    { id: 'adulto', label: 'Adulto', hint: 'Faixas azul → preta', icon: UserRound },
    { id: 'kids', label: 'Atleta Kids', hint: 'Faixas infantis IBJJF', icon: Baby },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map(({ id, label, hint, icon: Icon }) => {
        const active = value === id;
        return (
          <motion.button
            key={id}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(id)}
            className={cn(
              'rounded-xl border p-4 text-left transition-all duration-300',
              active
                ? 'border-neon/40 bg-neon/10 shadow-glow'
                : 'border-zinc-800 bg-surface/60 hover:border-zinc-600'
            )}
          >
            <Icon className={cn('mb-2 h-5 w-5', active ? 'text-neon' : 'text-zinc-500')} />
            <p className={cn('text-sm font-bold', active ? 'text-neon' : 'text-zinc-200')}>{label}</p>
            <p className="mt-1 text-[11px] text-zinc-500">{hint}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
