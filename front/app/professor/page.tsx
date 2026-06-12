'use client';



import { useMemo } from 'react';

import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion';

import { ChevronRight, GraduationCap, Loader2, RefreshCw, Users } from 'lucide-react';

import { AppShell } from '@/components/layout/AppShell';

import { BeltAvatar } from '@/components/ui/BeltAvatar';

import { useAuth } from '@/lib/hooks/useAuth';

import { useApi } from '@/lib/hooks/useApi';

import { getProfessorAlunos, getProfessorBiblioteca } from '@/lib/api/endpoints';

import { BELT_THEMES } from '@/lib/bjj/belt-theme';

import { cn } from '@/lib/utils/cn';



export default function ProfessorPage() {

  const router = useRouter();

  const { user } = useAuth();

  const isProfessor = user?.role === 'professor' || user?.isAdmin;



  const {

    data: alunos,

    loading: loadingAlunos,

    refetch: refetchAlunos,

  } = useApi(getProfessorAlunos, [user?.id], Boolean(isProfessor));



  const {

    data: lutas,

    loading: loadingLutas,

    error,

    refetch: refetchLutas,

  } = useApi(getProfessorBiblioteca, [user?.id], Boolean(isProfessor));



  const loading = loadingAlunos || loadingLutas;



  const refetch = () => {

    refetchAlunos();

    refetchLutas();

  };



  const lutasPorAluno = useMemo(() => {
    const map = new Map<string, number>();
    for (const luta of lutas ?? []) {
      const key = luta.aluno_id ?? luta.aluno_name;
      if (!key) continue;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [lutas]);



  if (!isProfessor) {

    return (

      <AppShell>

        <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-6 text-sm text-amber-200">

          Painel exclusivo para professores. Faça login com uma conta de professor.

        </p>

      </AppShell>

    );

  }



  return (

    <AppShell>

      <motion.div

        initial={{ opacity: 0, y: 14 }}

        animate={{ opacity: 1, y: 0 }}

        className="mb-7"

      >

        <div className="flex flex-wrap items-start justify-between gap-4">

          <div>

            <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">

              Painel do professor

            </p>

            <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">

              Seus <span className="text-neon-gradient">alunos</span>

            </h1>

            <p className="mt-2 max-w-xl text-sm text-zinc-500">

              {user?.academyName ?? 'Academia'} — clique no aluno para ver as lutas dele.

            </p>

          </div>

          <button

            onClick={refetch}

            className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-surface/60 px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"

          >

            <RefreshCw className="h-3.5 w-3.5" />

            Atualizar

          </button>

        </div>



        <div className="mt-5 flex flex-wrap gap-3">

          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-surface/60 px-3 py-1.5 text-xs text-zinc-400">

            <GraduationCap className="h-3.5 w-3.5 text-neon" />

            {user?.name}

          </span>

          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-surface/60 px-3 py-1.5 text-xs text-zinc-400">

            <Users className="h-3.5 w-3.5" />

            {alunos ? `${alunos.length} alunos cadastrados` : '—'}

          </span>

        </div>

      </motion.div>



      {loading && (

        <div className="flex items-center gap-2 text-sm text-zinc-500">

          <Loader2 className="h-4 w-4 animate-spin" />

          Carregando dados da academia…

        </div>

      )}



      {error && (

        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">

          {error}

        </p>

      )}



      {alunos && alunos.length > 0 && (

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">

          {alunos.map((aluno, i) => {

            const totalLutas = lutasPorAluno.get(aluno.id) ?? lutasPorAluno.get(aluno.name) ?? 0;

            const aguardando = totalLutas === 0;



            return (

              <motion.button

                key={aluno.id}

                type="button"

                initial={{ opacity: 0, y: 12 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: Math.min(i * 0.05, 0.3) }}

                onClick={() => router.push(`/professor/alunos/${aluno.id}`)}

                className={cn(

                  'group flex w-full items-center gap-3 rounded-2xl border bg-surface/60 p-4 text-left transition-all',

                  'border-zinc-800 hover:-translate-y-0.5 hover:border-neon/30 hover:shadow-glow'

                )}

              >

                <BeltAvatar belt={aluno.belt} name={aluno.name} avatarUrl={aluno.avatarUrl} size="md" />

                <div className="min-w-0 flex-1">

                  <p className="truncate font-semibold text-white group-hover:text-neon">
                    {aluno.name}
                    {aluno.athleteCategory === 'kids' && (
                      <span className="ml-2 rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
                        Kids
                      </span>
                    )}
                  </p>

                  <p className="truncate text-xs text-zinc-500">{aluno.email}</p>

                  <p className="mt-1 text-xs text-zinc-400">

                    Faixa {BELT_THEMES[aluno.belt].label}

                    {aluno.weightKg ? ` · ${aluno.weightKg} kg` : ''}

                  </p>

                  <p

                    className={cn(

                      'mt-2 text-xs font-medium',

                      aguardando ? 'text-zinc-500' : 'text-neon'

                    )}

                  >

                    {aguardando

                      ? 'Aguardando luta'

                      : `${totalLutas} ${totalLutas === 1 ? 'luta' : 'lutas'}`}

                  </p>

                </div>

                <ChevronRight className="h-5 w-5 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-neon" />

              </motion.button>

            );

          })}

        </div>

      )}



      {alunos && alunos.length === 0 && !loading && (

        <p className="rounded-xl border border-zinc-800 bg-surface p-8 text-center text-sm text-zinc-500">

          Nenhum aluno cadastrado nesta academia ainda. O atleta precisa informar a mesma filiação

          no cadastro (ex.: &quot;{user?.academyName}&quot;).

        </p>

      )}

    </AppShell>

  );

}

