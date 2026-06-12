/** Fonte de vídeo da landing — arquivo local, URL externa ou YouTube. */

export type ParsedLandingVideo =
  | { kind: 'file'; src: string }
  | { kind: 'youtube'; id: string; start?: number };

/** Pexels — BJJ no tatame (licença gratuita Pexels). */
export function pexelsVideo(id: number): string {
  return `https://videos.pexels.com/video-files/${id}/${id}-hd_1920_1080_25fps.mp4`;
}

/** Mixkit — grappling/luta (licença gratuita Mixkit). */
export function mixkitVideo(id: number): string {
  return `https://assets.mixkit.co/videos/${id}/${id}-720.mp4`;
}

/** YouTube embed — use vídeos com licença permissiva (CC, stock, domínio público). */
export function youtubeVideo(id: string, start?: number): string {
  return start ? `youtube:${id}@${start}` : `youtube:${id}`;
}

export function parseLandingVideo(src: string): ParsedLandingVideo {
  if (src.startsWith('youtube:')) {
    const payload = src.slice('youtube:'.length);
    const [id, startRaw] = payload.split('@');
    const start = startRaw ? Number.parseInt(startRaw, 10) : undefined;
    return { kind: 'youtube', id, start: Number.isFinite(start) ? start : undefined };
  }
  return { kind: 'file', src };
}

export function isLandingVideoSrc(src: string): boolean {
  if (src.startsWith('youtube:')) return true;
  return (
    src.endsWith('.mp4') ||
    src.endsWith('.webm') ||
    src.includes('videos.pexels.com') ||
    src.includes('mixkit.co')
  );
}

export function youtubeEmbedUrl(id: string, start?: number): string {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: id,
    controls: '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    iv_load_policy: '3',
    disablekb: '1',
    fs: '0',
    enablejsapi: '0',
  });
  if (start && start > 0) params.set('start', String(start));
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}
