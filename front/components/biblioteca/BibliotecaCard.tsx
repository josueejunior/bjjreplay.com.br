'use client';

import { motion } from 'framer-motion';
import { Calendar, Clapperboard, MapPin, Play, Sparkles, Swords, User } from 'lucide-react';
import { ProcessingStatus } from '@/components/biblioteca/ProcessingStatus';
import { Badge } from '@/components/ui/Badge';
import { BELT_THEMES } from '@/lib/bjj/belt-theme';
import { isLutaProcessing, lutaStatusLabel } from '@/lib/biblioteca/status';
import { cn } from '@/lib/utils/cn';
import type { LutaBiblioteca } from '@/types';

interface BibliotecaCardProps {
  luta: LutaBiblioteca;
  index: number;
  onClick: (luta: LutaBiblioteca) => void;
  showAthleteName?: boolean;
}

export function BibliotecaCard({ luta, index, onClick, showAthleteName = false }: BibliotecaCardProps) {
  const processing = isLutaProcessing(luta.status);
  const delivered = luta.status === 'ENTREGUE';
  const hasReels = Boolean(luta.url_reels_vertical);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.45), ease: 'easeOut' }}
      onClick={() => delivered && onClick(luta)}
      className={cn(
        'card-premium overflow-hidden rounded-2xl border border-zinc-800 transition-all duration-300',
        delivered &&
          'group cursor-pointer hover:-translate-y-1 hover:border-neon/30 hover:shadow-glow',
        processing && 'border-zinc-800/80'
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-zinc-950">
        {processing ? (
          <ProcessingStatus status={luta.status} compact />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/25">
              <span className="flex h-[52px] w-[52px] scale-75 items-center justify-center rounded-full bg-neon opacity-0 shadow-glow-strong transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                <Play className="ml-0.5 h-5 w-5 fill-black text-black" />
              </span>
            </div>
            <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md border border-neon/30 bg-black/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-neon backdrop-blur-sm">
              <Clapperboard className="h-3 w-3" />
              Replay 16:9
            </span>
            {hasReels && (
              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-md border border-violet-400/30 bg-black/80 px-2 py-1 text-[10px] font-semibold text-violet-300 backdrop-blur-sm">
                <Sparkles className="h-3 w-3" />
                Reels Black
              </span>
            )}
          </>
        )}
      </div>

      <div className="p-4">
        {showAthleteName && luta.aluno_name && (
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-neon">
            <User className="h-3.5 w-3.5" />
            {luta.aluno_name}
          </p>
        )}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-zinc-100 transition-colors duration-300 group-hover:text-neon">
            {luta.opponent_name ? (
              <span className="flex items-center gap-1.5">
                <Swords className="h-4 w-4 shrink-0 text-zinc-500" />
                vs {luta.opponent_name}
              </span>
            ) : (
              `Luta #${luta.id_luta}`
            )}
          </h3>
          <Badge
            variant={
              luta.status === 'ENTREGUE'
                ? 'neon'
                : luta.status === 'PROCESSANDO'
                  ? 'premium'
                  : 'zinc'
            }
          >
            {lutaStatusLabel(luta.status)}
          </Badge>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(luta.data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        {(luta.event_name || luta.event_city) && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-600">
            <MapPin className="h-3.5 w-3.5" />
            {luta.event_name}
            {luta.event_city ? ` · ${luta.event_city}` : ''}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {luta.belt_at_fight && (
            <Badge variant="zinc" className="text-[10px]">
              Faixa {BELT_THEMES[luta.belt_at_fight].label}
            </Badge>
          )}
          {luta.category && (
            <Badge variant="zinc" className="text-[10px]">
              {luta.category}
            </Badge>
          )}
        </div>
        {processing && (
          <p className="mt-2 text-xs text-zinc-600">
            Atualizamos automaticamente — sem recarregar a página.
          </p>
        )}
      </div>
    </motion.article>
  );
}
