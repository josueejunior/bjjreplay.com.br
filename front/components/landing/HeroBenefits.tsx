'use client';

import { Play, Flame, BarChart3, Trophy } from 'lucide-react';

const items = [
  { icon: Play, text: 'Replay após cada luta' },
  { icon: Flame, text: 'IA reconhece o atleta' },
  { icon: BarChart3, text: 'Histórico por campeonato' },
  { icon: Trophy, text: 'Download e compartilhar' },
];

/** Faixa compacta de benefícios — logo abaixo do hero limpo. */
export function HeroBenefits() {
  return (
    <section className="border-y border-white/10 bg-surface/80 backdrop-blur-sm">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-4 px-5 py-8 sm:grid-cols-4 sm:gap-x-8 sm:px-8 sm:py-10">
        {items.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neon/30 bg-neon/10">
              <Icon className="h-4 w-4 text-neon" />
            </span>
            <span className="text-xs font-medium leading-snug text-zinc-200 sm:text-sm">{text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
