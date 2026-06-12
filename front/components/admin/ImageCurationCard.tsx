'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeDate } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { AdminImage } from '@/types';

const CATEGORIES = ['Treino', 'Competição', 'Recuperação', 'Nutrição', 'Equipamento'];

interface ImageCurationCardProps {
  image: AdminImage;
  index: number;
  onCategorize: (imageId: string, category: string) => Promise<void>;
}

export function ImageCurationCard({ image, index, onCategorize }: ImageCurationCardProps) {
  const [pending, setPending] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(image.category);

  const handleClick = async (cat: string) => {
    setPending(cat);
    try {
      await onCategorize(image.id, cat);
      setCategory(cat);
    } finally {
      setPending(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.4) }}
      className={cn(
        'card-premium group overflow-hidden rounded-2xl border transition-all duration-300',
        category
          ? 'border-neon/40 shadow-glow'
          : 'border-zinc-800 hover:-translate-y-0.5 hover:border-zinc-600'
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image.imageUrl}
          alt={`Imagem enviada por ${image.uploadedBy}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent" />
        {category && (
          <div className="absolute right-2 top-2">
            <Badge variant="neon">
              <Check className="h-3 w-3" /> {category}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-center justify-between text-xs text-zinc-500">
          <span>@{image.uploadedBy}</span>
          <span>{formatRelativeDate(image.uploadedAt)}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const selected = category === cat;
            const isLoading = pending === cat;
            return (
              <button
                key={cat}
                onClick={() => handleClick(cat)}
                disabled={pending !== null}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-all duration-300 active:scale-95',
                  'disabled:pointer-events-none',
                  selected
                    ? 'border-neon bg-neon/15 text-neon shadow-glow'
                    : 'border-zinc-700 text-zinc-400 hover:border-neon/50 hover:text-neon',
                  isLoading && 'animate-pulse opacity-60'
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
