'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { parseLandingVideo, youtubeEmbedUrl } from '@/lib/landing/video-source';

interface LandingVideoProps {
  src: string;
  className?: string;
  grayscale?: boolean;
  /** Hero: carrega antes; demais vídeos só tocam quando visíveis. */
  priority?: boolean;
}

/** Vídeo mudo em loop — só reproduz no viewport para aliviar CPU/rede. */
export function LandingVideo({ src, className, grayscale = false, priority = false }: LandingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const parsed = parseLandingVideo(src);

  useEffect(() => {
    if (parsed.kind !== 'file') return;

    const el = videoRef.current;
    if (!el) return;

    const play = () => {
      void el.play().catch(() => undefined);
    };
    const pause = () => {
      el.pause();
    };

    if (priority) {
      play();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) play();
        else pause();
      },
      { rootMargin: '120px', threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [parsed.kind, priority]);

  if (parsed.kind === 'youtube') {
    return (
      <div className={cn('relative h-full w-full overflow-hidden bg-black', className)}>
        <iframe
          title=""
          aria-hidden
          tabIndex={-1}
          loading="lazy"
          src={youtubeEmbedUrl(parsed.id, parsed.start)}
          allow="autoplay; encrypted-media; picture-in-picture"
          className={cn(
            'pointer-events-none absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2',
            'h-[56.25vw] w-[177.78vh]',
            grayscale && 'grayscale'
          )}
        />
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay={priority}
      muted
      loop
      playsInline
      preload={priority ? 'auto' : 'none'}
      className={cn('h-full w-full object-cover', grayscale && 'grayscale', className)}
      src={parsed.src}
    />
  );
}
