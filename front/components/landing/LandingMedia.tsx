'use client';

import { isLandingVideoSrc } from '@/lib/landing/video-source';
import { LandingImage } from '@/components/landing/LandingImage';
import { LandingVideo } from '@/components/landing/LandingVideo';

interface LandingMediaProps {
  src: string;
  alt: string;
  className?: string;
  grayscale?: boolean;
  priority?: boolean;
}

/** Escolhe foto ou vídeo conforme a fonte — cards usam imagem, hero usa vídeo otimizado. */
export function LandingMedia({
  src,
  alt,
  className,
  grayscale = false,
  priority = false,
}: LandingMediaProps) {
  if (isLandingVideoSrc(src)) {
    return (
      <LandingVideo
        src={src}
        grayscale={grayscale}
        className={className}
        priority={priority}
      />
    );
  }

  return (
    <LandingImage
      src={src}
      alt={alt}
      grayscale={grayscale}
      className={className}
      priority={priority}
    />
  );
}
