'use client';

import { cn } from '@/lib/utils/cn';

interface LandingImageProps {
  src: string;
  alt: string;
  className?: string;
  grayscale?: boolean;
  priority?: boolean;
}

/** Foto estática otimizada para cards da landing. */
export function LandingImage({
  src,
  alt,
  className,
  grayscale = false,
  priority = false,
}: LandingImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      className={cn('h-full w-full object-cover', grayscale && 'grayscale', className)}
    />
  );
}
