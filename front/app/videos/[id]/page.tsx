'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Eye, Lock, User as UserIcon } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { ShareDownload } from '@/components/player/ShareDownload';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useApi } from '@/lib/hooks/useApi';
import { getVideo } from '@/lib/api/endpoints';
import { formatDuration, formatNumber, formatRelativeDate } from '@/lib/utils/format';

export default function VideoPage() {
  const params = useParams<{ id: string }>();
  const { data: video, loading, error, status } = useApi(() => getVideo(params.id), [params.id]);

  return (
    <AppShell>
      <Link
        href="/dashboard"
        className="group mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors duration-300 hover:text-neon"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
        Voltar ao feed
      </Link>

      {loading && (
        <div className="flex flex-col gap-5">
          <div className="skeleton aspect-video w-full" />
          <div className="skeleton h-20 w-full" />
        </div>
      )}

      {error && status === 403 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="top-shine flex flex-col items-center gap-4 rounded-2xl border border-amber-400/25 bg-gradient-to-b from-amber-400/[0.06] to-transparent p-12 text-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 shadow-[0_0_28px_rgba(251,191,36,0.2)]">
            <Lock className="h-7 w-7 text-amber-300" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-white">Conteúdo bloqueado</h2>
            <p className="mt-1.5 text-sm text-zinc-400">{error}</p>
          </div>
          <Link href="/#pricing">
            <Button size="lg">Fazer upgrade</Button>
          </Link>
        </motion.div>
      )}

      {error && status !== 403 && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </p>
      )}

      {video && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          {/* Player com glow ambiente */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px] bg-neon/[0.045] blur-3xl" />
            <VideoPlayer video={video} />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                {video.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-2 rounded-full border border-zinc-800 bg-surface/70 py-1 pl-1 pr-3 text-xs text-zinc-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.author.avatarUrl}
                    alt={video.author.name}
                    className="h-5 w-5 rounded-full ring-1 ring-zinc-700"
                  />
                  {video.author.name}
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-surface/70 px-3 py-1 text-xs text-zinc-400">
                  <Eye className="h-3.5 w-3.5" />
                  {formatNumber(video.views)} views
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-surface/70 px-3 py-1 text-xs text-zinc-400">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatRelativeDate(video.createdAt)}
                </span>
                <Badge variant="neon">
                  {video.orientation === 'vertical' ? 'Vertical' : 'Horizontal'} ·{' '}
                  {formatDuration(video.durationSeconds)}
                </Badge>
              </div>
            </div>
            <ShareDownload video={video} />
          </div>

          <div className="card-premium top-shine max-w-3xl rounded-2xl border border-zinc-800 p-6">
            <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
              <UserIcon className="h-3.5 w-3.5" />
              Sobre este treino
            </p>
            <p className="text-sm leading-relaxed text-zinc-300">{video.description}</p>
          </div>
        </motion.div>
      )}
    </AppShell>
  );
}
