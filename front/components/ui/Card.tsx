import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ className, hoverable, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-800 bg-surface p-5',
        hoverable &&
          'transition-all duration-300 ease-out hover:border-zinc-700 hover:shadow-glow hover:-translate-y-0.5',
        className
      )}
      {...props}
    />
  );
}
