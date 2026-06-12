'use client';

import { getBeltTheme } from '@/lib/bjj/belt-theme';
import { cn } from '@/lib/utils/cn';
import type { FaixaBelt } from '@/types';

interface BeltAvatarProps {
  name: string;
  avatarUrl?: string | null;
  belt: FaixaBelt;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { box: 'h-8 w-8', text: 'text-xs', bar: 'h-1' },
  md: { box: 'h-10 w-10', text: 'text-sm', bar: 'h-1.5' },
  lg: { box: 'h-16 w-16', text: 'text-lg', bar: 'h-2' },
};

/** Avatar com quadradinho e faixa colorida — personalização automática por faixa */
export function BeltAvatar({ name, avatarUrl, belt, size = 'md', className }: BeltAvatarProps) {
  const theme = getBeltTheme(belt);
  const s = sizes[size];

  return (
    <div className={cn('relative inline-flex flex-col items-center gap-1', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border-2 bg-zinc-950 transition-shadow duration-300',
          s.box
        )}
        style={{
          borderColor: theme.primary,
          boxShadow: `0 0 16px ${theme.glow}`,
        }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span
            className={cn('flex h-full w-full items-center justify-center font-bold', s.text)}
            style={{ color: theme.primary }}
          >
            {name[0]?.toUpperCase() ?? 'A'}
          </span>
        )}
        <span
          className={cn('absolute inset-x-0 bottom-0', s.bar)}
          style={{ background: theme.bar }}
        />
      </div>
    </div>
  );
}
