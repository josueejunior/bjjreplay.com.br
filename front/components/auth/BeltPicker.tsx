'use client';

import { motion } from 'framer-motion';
import { BELT_THEMES, getFaixaOrder } from '@/lib/bjj/belt-theme';
import { cn } from '@/lib/utils/cn';
import type { AthleteCategory, FaixaBelt } from '@/types';

interface BeltPickerProps {
  value: FaixaBelt | null;
  onChange: (belt: FaixaBelt) => void;
  category?: AthleteCategory;
}

export function BeltPicker({ value, onChange, category = 'adulto' }: BeltPickerProps) {
  const belts = getFaixaOrder(category);
  const isKids = category === 'kids';

  return (
    <div>
      <p className="mb-3 text-center text-xs text-zinc-500">
        {isKids ? 'Faixas infantis (IBJJF)' : 'Faixas adulto'}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {belts.map((belt) => {
          const theme = BELT_THEMES[belt];
          const active = value === belt;
          return (
            <motion.button
              key={belt}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(belt)}
              className={cn(
                'relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-300',
                active
                  ? 'border-white/20 shadow-glow'
                  : 'border-zinc-800 bg-surface/60 hover:border-zinc-600'
              )}
              style={
                active
                  ? {
                      borderColor: theme.primary,
                      boxShadow: `0 0 24px ${theme.glow}`,
                    }
                  : undefined
              }
            >
              <span
                className="mb-3 block h-2 w-full rounded-full"
                style={{ background: theme.bar, boxShadow: active ? `0 0 12px ${theme.glow}` : undefined }}
              />
              <span
                className="text-sm font-bold"
                style={{ color: active ? theme.primary : undefined }}
              >
                Faixa {theme.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
