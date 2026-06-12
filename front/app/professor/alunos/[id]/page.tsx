'use client';



import { useState } from 'react';

import Link from 'next/link';

import { useParams, useRouter } from 'next/navigation';

import { motion } from 'framer-motion';

import { ArrowLeft, Clapperboard, Images, Loader2, RefreshCw } from 'lucide-react';

import { AppShell } from '@/components/layout/AppShell';

import { BibliotecaCard } from '@/components/biblioteca/BibliotecaCard';

import { BibliotecaTabs, type BibliotecaTab } from '@/components/biblioteca/BibliotecaTabs';

import { FotoCard } from '@/components/biblioteca/FotoCard';

import { BeltAvatar } from '@/components/ui/BeltAvatar';

import { useAuth } from '@/lib/hooks/useAuth';

import { useApi } from '@/lib/hooks/useApi';

import { useBibliotecaPolling } from '@/lib/hooks/useBibliotecaPolling';

import { getBibliotecaFotos, getProfessorAluno } from '@/lib/api/endpoints';

import { BELT_THEMES } from '@/lib/bjj/belt-theme';

import type { LutaBiblioteca } from '@/types';



export default function ProfessorAlunoPage() {

  const router = useRouter();

  const params = useParams<{ id: string }>();

  const alunoId = params.id;

  const { user } = useAuth();

  const isProfessor = user?.role === 'professor' || user?.isAdmin;

  const [tab, setTab] = useState<BibliotecaTab>('replays');



  const {

    data: aluno,

    loading: loadingAluno,

    error: alunoError,

  } = useApi(() => getProfessorAluno(alunoId), [alunoId], Boolean(isProfessor && alunoId));



  const {

    data: lutas,

    loading: loadingLutas,

    error: lutasError,

    isPolling,

    refetch,

  } = useBibliotecaPolling(alunoId, Boolean(isProfessor && alunoId));



  const {

    data: fotos,

    loading: loadingFotos,

    error: fotosError,

    refetch: refetchFotos,

  } = useApi(() => getBibliotecaFotos(alunoId), [alunoId], Boolean(isProfessor && alunoId));



  const showReplays = tab === 'replays';
  const showFotos = tab === 'fotos';

  const loading = loadingAluno || (showReplays ? loadingLutas : loadingFotos);

  const error = alunoError ?? (showReplays ? lutasError : fotosError);



  const handleClick = (luta: LutaBiblioteca) => {

    if (luta.status !== 'ENTREGUE') return;

    router.push(`/biblioteca/${luta.id_luta}?aluno=${alunoId}`);

  };



  const handleRefresh = () => {

    refetch();

    refetchFotos();

  };



  if (!isProfessor) {

    return (

      <AppShell>

        <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-6 text-sm text-amber-200">

          Painel exclusivo para professores.

        </p>

      </AppShell>

    );

  }



  return (

    <AppShell>

      <Link

        href="/professor"

        className="group mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-neon"

      >

        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />

        Voltar aos alunos

      </Link>



      {loadingAluno && (

        <div className="flex items-center gap-2 text-sm text-zinc-500">

          <Loader2 className="h-4 w-4 animate-spin" />

          Carregando aluno…

        </div>

      )}



      {error && (

        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">

          {error}

        </p>

      )}



      {aluno && (

        <motion.div

          initial={{ opacity: 0, y: 14 }}

          animate={{ opacity: 1, y: 0 }}

          className="mb-7 flex flex-wrap items-start justify-between gap-4"

        >

          <div className="flex items-center gap-4">

            <BeltAvatar belt={aluno.belt} name={aluno.name} avatarUrl={aluno.avatarUrl} size="lg" />

            <div>

              <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">Aluno</p>

              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white">{aluno.name}</h1>

              <p className="mt-1 text-sm text-zinc-500">

                Faixa {BELT_THEMES[aluno.belt].label}

                {aluno.weightKg ? ` · ${aluno.weightKg} kg` : ''}

              </p>

            </div>

          </div>

          <button

            onClick={handleRefresh}

            className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-surface/60 px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"

          >

            <RefreshCw className={`h-3.5 w-3.5 ${isPolling && showReplays ? 'animate-spin' : ''}`} />

            Atualizar

          </button>

        </motion.div>

      )}



      {aluno && (

        <BibliotecaTabs

          active={tab}

          onChange={setTab}

          replayCount={lutas?.length}

          fotoCount={fotos?.length}

        />

      )}



      {loading && aluno && (

        <div className="flex items-center gap-2 text-sm text-zinc-500">

          <Loader2 className="h-4 w-4 animate-spin" />

          Carregando {showReplays ? 'lutas' : 'fotos'}…

        </div>

      )}



      {showReplays && lutas && lutas.length > 0 && (

        <section>

          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-300">

            <Clapperboard className="h-4 w-4 text-neon" />

            {lutas.length} {lutas.length === 1 ? 'luta' : 'lutas'}

          </h2>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

            {lutas.map((luta, i) => (

              <BibliotecaCard key={luta.id_luta} luta={luta} index={i} onClick={handleClick} />

            ))}

          </div>

        </section>

      )}



      {showReplays && aluno && lutas && lutas.length === 0 && !loadingLutas && (

        <p className="rounded-xl border border-zinc-800 bg-surface p-8 text-center text-sm text-zinc-500">

          {aluno.name} ainda não tem lutas na biblioteca. Elas aparecem aqui quando a boxe enviar o

          replay.

        </p>

      )}



      {showFotos && fotos && fotos.length > 0 && (

        <section>

          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-300">

            <Images className="h-4 w-4 text-neon" />

            {fotos.length} {fotos.length === 1 ? 'foto' : 'fotos'}

          </h2>

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">

            {fotos.map((foto, i) => (

              <FotoCard key={foto.id_foto} foto={foto} index={i} />

            ))}

          </div>

        </section>

      )}



      {showFotos && aluno && fotos && fotos.length === 0 && !loadingFotos && (

        <p className="rounded-xl border border-zinc-800 bg-surface p-8 text-center text-sm text-zinc-500">

          {aluno.name} ainda não tem fotos na biblioteca.

        </p>

      )}

    </AppShell>

  );

}

