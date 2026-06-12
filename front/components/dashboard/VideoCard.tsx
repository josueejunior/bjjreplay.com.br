'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, Lock, Play, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatDuration, formatNumber, formatRelativeDate } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { Video } from '@/types';

interface VideoCardProps {
  video: Video;
  index: number;
  onClick: (video: Video) => void;
}

export function VideoCard({ video, index, onClick }: VideoCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.45), ease: 'easeOut' }}
      onClick={() => onClick(video)}
      className={cn(
        'card-premium group cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 transition-all duration-300',
        'hover:-translate-y-1 hover:border-neon/30 hover:shadow-glow',
        video.locked && 'hover:border-amber-400/30 hover:shadow-[0_0_20px_rgba(251,191,36,0.12)]'
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            'object-cover transition-all duration-500 group-hover:scale-[1.06]',
            video.locked && 'blur-[7px] brightness-[0.45] saturate-50'
          )}
        />
        {/* Gradiente de leitura na base */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />

        {video.locked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/40 bg-black/60 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-amber-400/70 group-hover:shadow-[0_0_24px_rgba(251,191,36,0.35)]">
              <Lock className="h-5 w-5 text-amber-300" />
            </span>
            <Badge variant={video.requiredPlan === 'black' ? 'black' : 'premium'}>
              <Sparkles className="h-3 w-3" />
              {video.requiredPlan === 'black' ? 'Exclusivo Black' : 'Premium'}
            </Badge>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/25">
            <span className="flex h-13 w-13 h-[52px] w-[52px] scale-75 items-center justify-center rounded-full bg-neon opacity-0 shadow-glow-strong transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
              <Play className="ml-0.5 h-5 w-5 fill-black text-black" />
            </span>
          </div>
        )}

        <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-md border border-white/10 bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-zinc-200 backdrop-blur-sm">
          <Play className="h-2.5 w-2.5 fill-current" />
          {formatDuration(video.durationSeconds)}
        </span>
        {video.orientation === 'vertical' && (
          <span className="absolute left-2.5 top-2.5 rounded-md border border-neon/30 bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neon backdrop-blur-sm">
            Vertical
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug text-zinc-100 transition-colors duration-300 group-hover:text-neon">
          {video.title}
        </h3>
        <div className="mt-3 flex items-center justify-between border-t border-zinc-800/70 pt-3 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.author.avatarUrl}
              alt={video.author.name}
              className="h-5 w-5 rounded-full ring-1 ring-zinc-700"
            />
            <span className="transition-colors group-hover:text-zinc-300">{video.author.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {formatNumber(video.views)}
            </span>
            <span>{formatRelativeDate(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
