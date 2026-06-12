'use client';

import { Clapperboard, Images } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type BibliotecaTab = 'replays' | 'fotos';

interface BibliotecaTabsProps {
  active: BibliotecaTab;
  onChange: (tab: BibliotecaTab) => void;
  replayCount?: number;
  fotoCount?: number;
}

const TABS: { id: BibliotecaTab; label: string; icon: typeof Clapperboard }[] = [
  { id: 'replays', label: 'Replays', icon: Clapperboard },
  { id: 'fotos', label: 'Fotos', icon: Images },
];

export function BibliotecaTabs({ active, onChange, replayCount, fotoCount }: BibliotecaTabsProps) {
  const counts: Record<BibliotecaTab, number | undefined> = {
    replays: replayCount,
    fotos: fotoCount,
  };

  return (
    <div
      role="tablist"
      aria-label="Seções da biblioteca"
      className="mb-6 inline-flex rounded-xl border border-zinc-800 bg-surface/60 p-1"
    >
      {TABS.map(({ id, label, icon: Icon }) => {
        const selected = active === id;
        const count = counts[id];

        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(id)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
              selected
                ? 'bg-neon text-black shadow-glow'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
            {count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                  selected ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-500'
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
