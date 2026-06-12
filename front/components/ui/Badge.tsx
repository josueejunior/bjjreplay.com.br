import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type BadgeVariant = 'neon' | 'metallic' | 'zinc' | 'premium' | 'black';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  neon: 'bg-neon/10 text-neon border-neon/30',
  metallic: 'bg-zinc-400/10 text-zinc-300 border-zinc-500/30',
  zinc: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  premium: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
  black: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
};

export function Badge({ className, variant = 'neon', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
