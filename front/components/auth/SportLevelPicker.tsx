'use client';

import { motion } from 'framer-motion';
import { Activity, Flame, Medal, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { SportLevel } from '@/types';

interface SportLevelPickerProps {
  value: SportLevel | null;
  onChange: (level: SportLevel) => void;
}

const levels: { id: SportLevel; label: string; description: string; icon: typeof Activity }[] = [
  {
    id: 'iniciante',
    label: 'Iniciante',
    description: 'Estou começando agora',
    icon: Activity,
  },
  {
    id: 'intermediario',
    label: 'Intermediário',
    description: 'Treino com regularidade',
    icon: Flame,
  },
  {
    id: 'avancado',
    label: 'Avançado',
    description: 'Treino sério há anos',
    icon: Medal,
  },
  {
    id: 'pro',
    label: 'Pro',
    description: 'Compito profissionalmente',
    icon: Rocket,
  },
];

export function SportLevelPicker({ value, onChange }: SportLevelPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {levels.map((level, i) => {
        const selected = value === level.id;
        return (
          <motion.button
            key={level.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(level.id)}
            className={cn(
              'flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all duration-300',
              selected
                ? 'border-neon bg-neon/10 shadow-glow'
                : 'border-zinc-800 bg-surface-raised hover:border-zinc-600'
            )}
          >
            <level.icon className={cn('h-5 w-5', selected ? 'text-neon' : 'text-zinc-500')} />
            <span className={cn('text-sm font-semibold', selected ? 'text-neon' : 'text-zinc-200')}>
              {level.label}
            </span>
            <span className="text-xs text-zinc-500">{level.description}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
