'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { FotoBiblioteca } from '@/types';

interface FotoCardProps {
  foto: FotoBiblioteca;
  index: number;
  className?: string;
}

export function FotoCard({ foto, index, className }: FotoCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.45), ease: 'easeOut' }}
      className={cn(
        'card-premium group overflow-hidden rounded-2xl border border-zinc-800 transition-all duration-300 hover:-translate-y-1 hover:border-neon/30 hover:shadow-glow',
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-950">
        <Image
          src={foto.url}
          alt={foto.caption ?? 'Foto da biblioteca'}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="p-3.5">
        {foto.caption && (
          <p className="line-clamp-2 text-sm font-medium text-zinc-100">{foto.caption}</p>
        )}
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-zinc-500">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          {new Date(foto.data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        {foto.event_name && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-600">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {foto.event_name}
          </p>
        )}
      </div>
    </motion.article>
  );
}
