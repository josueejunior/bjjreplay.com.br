'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Maximize,
  Pause,
  Play,
  RectangleHorizontal,
  RectangleVertical,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { formatDuration } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

interface ReplayPlayerProps {
  urlHorizontal: string;
  urlReelsVertical?: string | null;
}

type Orientation = 'horizontal' | 'vertical';

export function ReplayPlayer({ urlHorizontal, urlReelsVertical }: ReplayPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const hasVertical = Boolean(urlReelsVertical);
  const [orientation, setOrientation] = useState<Orientation>('horizontal');
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);

  const activeSrc =
    orientation === 'vertical' && urlReelsVertical ? urlReelsVertical : urlHorizontal;

  const showControls = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 2500);
  }, []);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  // Troca de orientação reinicia o player com a URL da CDN
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    setProgress(0);
    setPlaying(false);
    el.load();
  }, [activeSrc]);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) el.play();
    else el.pause();
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen();
  };

  const onSeek = (value: number) => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = value;
    setProgress(value);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {hasVertical && (
        <div className="flex items-center gap-1 rounded-full border border-zinc-800 bg-surface p-1">
          <button
            onClick={() => setOrientation('horizontal')}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300',
              orientation === 'horizontal'
                ? 'bg-neon/15 text-neon shadow-glow'
                : 'text-zinc-500 hover:text-zinc-200'
            )}
          >
            <RectangleHorizontal className="h-3.5 w-3.5" /> Replay 16:9
          </button>
          <button
            onClick={() => setOrientation('vertical')}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300',
              orientation === 'vertical'
                ? 'bg-violet-400/15 text-violet-300 shadow-[0_0_16px_rgba(167,139,250,0.25)]'
                : 'text-zinc-500 hover:text-zinc-200'
            )}
          >
            <RectangleVertical className="h-3.5 w-3.5" /> Reels Black 9:16
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        onMouseMove={showControls}
        onClick={showControls}
        className={cn(
          'relative w-full overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-glow transition-all duration-500',
          orientation === 'horizontal' ? 'aspect-video' : 'mx-auto aspect-[9/16] max-w-[420px]'
        )}
      >
        <video
          key={activeSrc}
          ref={videoRef}
          src={activeSrc}
          muted={muted}
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onClick={togglePlay}
          className="h-full w-full object-contain"
        />

        <AnimatePresence>
          {!playing && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={togglePlay}
              aria-label="Reproduzir"
              className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-neon/90 transition-transform duration-300 hover:scale-110 hover:shadow-glow-strong"
            >
              <Play className="ml-1 h-7 w-7 fill-black text-black" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(controlsVisible || !playing) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-10"
            >
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={progress}
                onChange={(e) => onSeek(Number(e.target.value))}
                aria-label="Progresso do vídeo"
                className="player-range w-full"
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    aria-label={playing ? 'Pausar' : 'Reproduzir'}
                    className="text-white transition-colors hover:text-neon"
                  >
                    {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => setMuted((m) => !m)}
                    aria-label={muted ? 'Ativar som' : 'Silenciar'}
                    className="text-white transition-colors hover:text-neon"
                  >
                    {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                  <span className="text-xs text-zinc-300">
                    {formatDuration(progress)} / {formatDuration(duration)}
                  </span>
                </div>
                <button
                  onClick={toggleFullscreen}
                  aria-label="Tela cheia"
                  className="text-white transition-colors hover:text-neon"
                >
                  <Maximize className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-center text-xs text-zinc-600">
        Streaming direto da CDN Cloudflare — sem passar pela API.
      </p>
    </div>
  );
}
