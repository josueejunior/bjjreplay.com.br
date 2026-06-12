'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clapperboard, Loader2, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { BibliotecaCard } from '@/components/biblioteca/BibliotecaCard';
import { StatsSidebar } from '@/components/dashboard/StatsSidebar';
import { BELT_THEMES } from '@/lib/bjj/belt-theme';
import { isLutaProcessing } from '@/lib/biblioteca/status';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRedirectProfessor } from '@/lib/hooks/useRedirectProfessor';
import { useBibliotecaPolling } from '@/lib/hooks/useBibliotecaPolling';
import { cn } from '@/lib/utils/cn';
import type { LutaBiblioteca } from '@/types';

type Filter = 'todos' | 'entregues' | 'processando';

const filters: { id: Filter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'entregues', label: 'Prontos' },
  { id: 'processando', label: 'Em processamento' },
];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return 'Boa madrugada';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function DashboardPage() {
  const router = useRouter();
  const redirecting = useRedirectProfessor();
  const { user } = useAuth();
  const { data: lutas, loading, error, isPolling, refetch } = useBibliotecaPolling(user?.id);
  const [filter, setFilter] = useState<Filter>('todos');

  const filtered = useMemo(() => {
    if (!lutas) return null;
    if (filter === 'entregues') return lutas.filter((l) => l.status === 'ENTREGUE');
    if (filter === 'processando') return lutas.filter((l) => isLutaProcessing(l.status));
    return lutas;
  }, [lutas, filter]);

  const beltLabel = user?.belt ? BELT_THEMES[user.belt].label : 'Branca';

  const today = useMemo(
    () =>
      new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
    []
  );

  const handleClick = (luta: LutaBiblioteca) => {
    router.push(`/biblioteca/${luta.id_luta}`);
  };

  if (redirecting) return null;

  return (
    <AppShell sidebar={<StatsSidebar />}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-7"
      >
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 first-letter:uppercase">
          {today}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {greeting()},{' '}
            <span className="text-neon-gradient">{user?.name ?? 'Atleta'}</span>
          </h1>
          <span className="flex items-center gap-1.5 rounded-full border border-neon/25 bg-neon/10 px-3 py-1 text-xs font-medium text-neon">
            Faixa {beltLabel}
            {user?.degree ? ` · ${user.degree}º grau` : ''}
          </span>
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          Seus replays de luta enviados pela academia aparecem aqui assim que forem processados.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {isPolling && (
            <span className="inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-3 py-1.5 text-xs font-medium text-neon">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Atualizando status…
            </span>
          )}
          <button
            onClick={refetch}
            title="Atualizar agora"
            className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-surface/60 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Atualizar
          </button>
        </div>
      </motion.div>

      <div className="mb-6 flex items-center gap-2">
        <span className="mr-1 flex items-center gap-1.5 text-xs text-zinc-600">
          <SlidersHorizontal className="h-3.5 w-3.5" />
        </span>
        {filters.map((f) => {
          const active = filter === f.id;
          const count =
            lutas &&
            (f.id === 'todos'
              ? lutas.length
              : f.id === 'entregues'
                ? lutas.filter((l) => l.status === 'ENTREGUE').length
                : lutas.filter((l) => isLutaProcessing(l.status)).length);
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300 active:scale-95',
                active
                  ? 'border-neon/50 bg-neon/10 text-neon shadow-glow'
                  : 'border-zinc-800 bg-surface/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
              )}
            >
              {f.label}
              {count !== null && count !== undefined && (
                <span
                  className={cn(
                    'rounded-full px-1.5 text-[10px]',
                    active ? 'bg-neon/15 text-neon' : 'bg-zinc-800 text-zinc-500'
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-72" />
          ))}
        </div>
      )}

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          Erro ao carregar seus replays: {error}
        </p>
      )}

      {filtered && filtered.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((luta, i) => (
            <BibliotecaCard key={luta.id_luta} luta={luta} index={i} onClick={handleClick} />
          ))}
        </div>
      )}

      {filtered && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-surface p-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900">
            <Clapperboard className="h-6 w-6 text-zinc-500" />
          </span>
          <p className="text-sm text-zinc-400">
            {filter === 'todos'
              ? 'Nenhum replay enviado ainda. Quando a academia registrar sua luta, ela aparecerá aqui.'
              : 'Nenhum replay nesta categoria.'}
          </p>
          {filter === 'todos' && (
            <Link
              href="/biblioteca"
              className="text-xs font-medium text-neon transition-colors hover:text-neon-dim"
            >
              Ver biblioteca completa →
            </Link>
          )}
        </div>
      )}
    </AppShell>
  );
}
