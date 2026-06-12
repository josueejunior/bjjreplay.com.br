'use client';



import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion';

import { Clapperboard, Images, Loader2, RefreshCw } from 'lucide-react';

import { AppShell } from '@/components/layout/AppShell';

import { BibliotecaCard } from '@/components/biblioteca/BibliotecaCard';

import { BibliotecaTabs, type BibliotecaTab } from '@/components/biblioteca/BibliotecaTabs';

import { FotoCard } from '@/components/biblioteca/FotoCard';

import { StatsSidebar } from '@/components/dashboard/StatsSidebar';

import { useAuth } from '@/lib/hooks/useAuth';

import { useRedirectProfessor } from '@/lib/hooks/useRedirectProfessor';

import { useBibliotecaPolling } from '@/lib/hooks/useBibliotecaPolling';

import { useApi } from '@/lib/hooks/useApi';

import { getBibliotecaFotos } from '@/lib/api/endpoints';

import type { LutaBiblioteca } from '@/types';



export default function BibliotecaPage() {

  const router = useRouter();

  const redirecting = useRedirectProfessor();

  const { user } = useAuth();

  const [tab, setTab] = useState<BibliotecaTab>('replays');

  const { data: lutas, loading, error, isPolling, refetch } = useBibliotecaPolling(user?.id);

  const {

    data: fotos,

    loading: loadingFotos,

    error: fotosError,

    refetch: refetchFotos,

  } = useApi(() => getBibliotecaFotos(user!.id), [user?.id], Boolean(user?.id));



  const handleClick = (luta: LutaBiblioteca) => {

    router.push(`/biblioteca/${luta.id_luta}`);

  };



  const handleRefresh = () => {

    refetch();

    refetchFotos();

  };



  if (redirecting) return null;



  const showReplays = tab === 'replays';

  const showFotos = tab === 'fotos';

  const isLoading = showReplays ? loading : loadingFotos;

  const activeError = showReplays ? error : fotosError;



  return (

    <AppShell sidebar={<StatsSidebar />}>

      <motion.div

        initial={{ opacity: 0, y: 14 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.45 }}

        className="mb-7"

      >

        <div className="flex flex-wrap items-start justify-between gap-4">

          <div>

            <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">

              Minha biblioteca

            </p>

            <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">

              {showReplays ? (

                <>

                  Replays das suas <span className="text-neon-gradient">lutas</span>

                </>

              ) : (

                <>

                  Fotos dos seus <span className="text-neon-gradient">eventos</span>

                </>

              )}

            </h1>

            <p className="mt-2 max-w-xl text-sm text-zinc-500">

              {showReplays

                ? 'O motor de renderização roda em background na VPS. Enquanto processa, esta tela atualiza sozinha — você nunca fica esperando um arquivo de 1 GB carregar.'

                : 'Registros fotográficos de treinos, campeonatos e momentos no tatame — tudo organizado por data.'}

            </p>

          </div>



          <div className="flex items-center gap-2">

            {showReplays && isPolling && (

              <span className="inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-3 py-1.5 text-xs font-medium text-neon">

                <Loader2 className="h-3.5 w-3.5 animate-spin" />

                Atualizando status…

              </span>

            )}

            <button

              onClick={handleRefresh}

              title="Atualizar agora"

              className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-surface/60 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200"

            >

              <RefreshCw className="h-3.5 w-3.5" />

              Atualizar

            </button>

          </div>

        </div>

      </motion.div>



      <BibliotecaTabs

        active={tab}

        onChange={setTab}

        replayCount={lutas?.length}

        fotoCount={fotos?.length}

      />



      {isLoading && (

        <div

          className={

            showFotos

              ? 'grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4'

              : 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3'

          }

        >

          {Array.from({ length: showFotos ? 4 : 3 }).map((_, i) => (

            <div key={i} className={showFotos ? 'skeleton aspect-[4/5]' : 'skeleton h-72'} />

          ))}

        </div>

      )}



      {activeError && (

        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">

          Erro ao carregar biblioteca: {activeError}

        </p>

      )}



      {showReplays && lutas && lutas.length > 0 && (

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {lutas.map((luta, i) => (

            <BibliotecaCard key={luta.id_luta} luta={luta} index={i} onClick={handleClick} />

          ))}

        </div>

      )}



      {showReplays && lutas && lutas.length === 0 && !loading && (

        <div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-surface p-12 text-center">

          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900">

            <Clapperboard className="h-6 w-6 text-zinc-500" />

          </span>

          <p className="text-sm text-zinc-400">Nenhuma luta na biblioteca ainda.</p>

        </div>

      )}



      {showFotos && fotos && fotos.length > 0 && (

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">

          {fotos.map((foto, i) => (

            <FotoCard key={foto.id_foto} foto={foto} index={i} />

          ))}

        </div>

      )}



      {showFotos && fotos && fotos.length === 0 && !loadingFotos && (

        <div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-surface p-12 text-center">

          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900">

            <Images className="h-6 w-6 text-zinc-500" />

          </span>

          <p className="text-sm text-zinc-400">Nenhuma foto na biblioteca ainda.</p>

        </div>

      )}

    </AppShell>

  );

}

