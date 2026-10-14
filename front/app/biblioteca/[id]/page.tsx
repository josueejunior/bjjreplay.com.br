'use client';

import Link from 'next/link';
import { Suspense, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clapperboard, Loader2, MapPin, Swords } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ProcessingStatus } from '@/components/biblioteca/ProcessingStatus';
import { ReplayPlayer } from '@/components/biblioteca/ReplayPlayer';
import { ReplayShareDownload } from '@/components/biblioteca/ReplayShareDownload';
import { Badge } from '@/components/ui/Badge';
import { BELT_THEMES } from '@/lib/bjj/belt-theme';
import { lutaStatusLabel } from '@/lib/biblioteca/status';
import { useAuth } from '@/lib/hooks/useAuth';
import { useBibliotecaPolling } from '@/lib/hooks/useBibliotecaPolling';
import { useApi } from '@/lib/hooks/useApi';
import { getProfessorBiblioteca } from '@/lib/api/endpoints';

export default function BibliotecaReplayPage() {
  return (
    <Suspense>
      <BibliotecaReplayContent />
    </Suspense>
  );
}

function BibliotecaReplayContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const lutaId = Number(params.id);
  const isProfessor = user?.role === 'professor' || user?.isAdmin;
  const alunoFromQuery = searchParams.get('aluno');
  const backHref =
    isProfessor && alunoFromQuery
      ? `/professor/alunos/${alunoFromQuery}`
      : isProfessor
        ? '/professor'
        : '/biblioteca';
  const backLabel =
    isProfessor && alunoFromQuery ? 'Voltar às lutas do aluno' : 'Voltar à biblioteca';

  const athlete = useBibliotecaPolling(!isProfessor ? user?.id : alunoFromQuery ?? undefined);
  const professor = useApi(getProfessorBiblioteca, [user?.id], Boolean(isProfessor && !alunoFromQuery));

  const lutas = isProfessor && alunoFromQuery ? athlete.data : isProfessor ? professor.data : athlete.data;
  const loading = isProfessor && alunoFromQuery ? athlete.loading : isProfessor ? professor.loading : athlete.loading;
  const error = isProfessor && alunoFromQuery ? athlete.error : isProfessor ? professor.error : athlete.error;
  const isPolling = isProfessor && alunoFromQuery ? athlete.isPolling : !isProfessor && athlete.isPolling;

  const luta = useMemo(
    () => lutas?.find((item) => item.id_luta === lutaId) ?? null,
    [lutas, lutaId]
  );

  const delivered = luta?.status === 'ENTREGUE' && Boolean(luta.url_horizontal);
  const title = luta?.opponent_name ? `vs ${luta.opponent_name}` : `Luta ${lutaId}`;

  return (
    <AppShell>
      <Link
        href={backHref}
        className="group mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors duration-300 hover:text-neon"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
        {backLabel}
      </Link>

      {loading && (
        <div className="flex flex-col gap-5">
          <div className="skeleton aspect-video w-full" />
          <div className="skeleton h-20 w-full" />
        </div>
      )}

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && !luta && !error && (
        <p className="rounded-xl border border-zinc-800 bg-surface p-8 text-center text-sm text-zinc-500">
          Luta não encontrada na biblioteca.
        </p>
      )}

      {luta && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          <div className="relative">
            <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px] bg-neon/[0.045] blur-3xl" />

            {delivered ? (
              <>
                <div className="mb-3 flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-black">
                  <span className="text-base">⚠️</span>
                  Este vídeo está em low stream para visualização no site. Para FULL HD clique em baixar.
                </div>
                <ReplayPlayer
                  urlHorizontal={luta.url_horizontal!}
                  urlReelsVertical={luta.url_reels_vertical}
                />
              </>
            ) : (
              <div className="card-premium top-shine overflow-hidden rounded-2xl border border-zinc-800">
                <ProcessingStatus status={luta.status} />
                {isPolling && (
                  <p className="border-t border-zinc-800/80 py-4 text-center text-xs text-zinc-500">
                    <Loader2 className="mr-1.5 inline h-3.5 w-3.5 animate-spin text-neon" />
                    Verificando status a cada 5 segundos…
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                <Clapperboard className="h-6 w-6 text-neon" />
                {luta.opponent_name ? (
                  <>
                    <Swords className="h-5 w-5 text-zinc-500" />
                    vs {luta.opponent_name}
                  </>
                ) : (
                  `Luta #${luta.id_luta}`
                )}
              </h1>
              {luta.aluno_name && (
                <p className="mt-1 text-sm text-zinc-500">Atleta: {luta.aluno_name}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant={delivered ? 'neon' : 'zinc'}>{lutaStatusLabel(luta.status)}</Badge>
                <span className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-surface/70 px-3 py-1 text-xs text-zinc-400">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(luta.data).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                {(luta.event_name || luta.event_city) && (
                  <span className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-surface/70 px-3 py-1 text-xs text-zinc-400">
                    <MapPin className="h-3.5 w-3.5" />
                    {luta.event_name}
                    {luta.event_city ? ` · ${luta.event_city}` : ''}
                  </span>
                )}
                {luta.belt_at_fight && (
                  <Badge variant="zinc">
                    Faixa {BELT_THEMES[luta.belt_at_fight].label}
                  </Badge>
                )}
                {luta.category && <Badge variant="zinc">{luta.category}</Badge>}
                {luta.url_reels_vertical && <Badge variant="black">Reels Black incluído</Badge>}
              </div>
            </div>

            {delivered && (
              <ReplayShareDownload
                title={title}
                urlHorizontal={luta.url_horizontal!}
                urlReelsVertical={luta.url_reels_vertical}
              />
            )}
          </div>
        </motion.div>
      )}
    </AppShell>
  );
}
