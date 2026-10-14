import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

const sizeClass = {
  sm: 'h-14 w-auto',
  nav: 'h-14 w-auto sm:h-[4.5rem]',
  md: 'h-20 w-auto',
  lg: 'h-28 w-auto',
  xl: 'h-36 w-auto sm:h-40',
} as const;

type LogoVariant = 'default' | 'elevated';

interface LogoProps {
  size?: keyof typeof sizeClass;
  showTagline?: boolean;
  markOnly?: boolean;
  className?: string;
  priority?: boolean;
  /** Brilho vermelho ponteira — use em headers/fundo escuro */
  variant?: LogoVariant;
}

const LOGO_WIDTH = 1024;
const LOGO_HEIGHT = 1024;

/** Logo oficial BJJ Replay */
export function Logo({
  size = 'sm',
  className,
  priority = false,
  variant: _variant = 'default',
}: LogoProps) {
  return (
    <Image
      src="/logo.png?v=4"
      alt="BJJ Replay — Análise e replay automatizados"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      unoptimized
      className={cn(
        'w-auto object-contain object-left',
        sizeClass[size],
        className,
      )}
    />
  );
}

export function LogoMark({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.png?v=4"
      alt="BJJ Replay"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      unoptimized
      className={cn('w-auto object-contain object-left', className)}
      style={{ height: size }}
    />
  );
}
