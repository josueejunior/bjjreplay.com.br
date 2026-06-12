'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'metallic' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold shadow-[0_0_20px_rgba(220,38,38,0.25)] hover:from-red-500 hover:to-red-600 hover:shadow-[0_0_28px_rgba(220,38,38,0.35)] active:scale-[0.98]',
  secondary:
    'bg-surface/80 text-zinc-200 border border-red-600/25 hover:border-red-500/45 hover:bg-surface-raised active:scale-[0.98]',
  ghost: 'text-zinc-300 hover:text-white hover:bg-white/5 active:scale-[0.98]',
  outline:
    'border border-red-600/40 text-red-200 hover:bg-red-600/10 hover:border-red-500/60 active:scale-[0.98]',
  metallic:
    'bg-metallic-gradient text-black font-semibold hover:opacity-90 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98]',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
  md: 'h-10 px-5 text-sm rounded-lg gap-2',
  lg: 'h-12 px-7 text-base rounded-lg gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 ease-out',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = 'Button';
