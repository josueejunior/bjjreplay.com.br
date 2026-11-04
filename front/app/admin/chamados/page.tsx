'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Inbox } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/lib/hooks/useAuth';
import { atualizarChamado, getChamadosAdmin, getPrintDoChamado } from '@/lib/api/endpoints';
import { STATUS_CHAMADO, STATUS_DO_TIPO, TIPO_CHAMADO, dataHora } from '@/lib/chamados-rotulos';
import { cn } from '@/lib/utils/cn';
import type { ChamadoAdmin, ChamadoStatus } from '@/types';

const ESTADOS: ChamadoStatus[] = ['recebido', 'vendo', 'procurando', 'encontrada', 'nao_encontrada', 'resolvido'];
const ROTULO_EXTRA: Record<string, string> = { data: 'Data da aula', aula: 'Aula', tatame: 'Tatame', horario: 'Horário aproximado', adversario: 'Com quem lutou', faltaram: 'Lutas que faltaram', foraDoPrazo: 'Fora do prazo de 3 dias' };
const sel = 'h-11 rounded-lg border border-zinc-700 bg-surface-raised px-3 text-base text-zinc-100';

export default function ChamadosAdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [linhas, setLinhas] = useState<ChamadoAdmin[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [tipo, setTipo] = useState('');
  const [aberto, setAberto] = useState<string | null>(null);
  const [resposta, setResposta] = useState('');
  const [print, setPrint] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setLinhas(await getChamadosAdmin({ ...(status && { status }), ...(tipo && { tipo }) }));
      setErro(null);
    } catch {
      setErro('Não consegui carregar os chamados.');
    }
  }, [status, tipo]);

  useEffect(() => {
    if (!authLoading && user && !user.isAdmin) router.replace('/dashboard');
  }, [authLoading, user, router]);
  useEffect(() => {
    if (user?.isAdmin) void carregar();
  }, [user, carregar]);

  const abrir = async (c: ChamadoAdmin) => {
    const fechando = aberto === c.id;
    setAberto(fechando ? null : c.id);
    setResposta(c.resposta ?? '');
    setPrint(null);
    if (!fechando && c.temPrint) setPrint(await getPrintDoChamado(c.id).catch(() => null));
  };

  const salvar = async (id: string, body: { status?: ChamadoStatus; resposta?: string | null }) => {
    try {
      await atualizarChamado(id, body);
      await carregar();
    } catch {
      setErro('Não consegui salvar a alteração.');
    }
  };

  const emAberto = linhas?.filter((l) => l.status !== 'resolvido').length ?? 0;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white">
          <Inbox className="h-7 w-7 text-neon" /> Chamados
        </h1>
        <p className="mt-2 text-base text-zinc-300">Erros avisados pelos alunos e pedidos de “minha luta não foi encontrada”.</p>
        {erro && <p role="alert" className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-base text-red-200">{erro}</p>}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filtrar por status" className={sel}>
            <option value="">Todos os status</option>
            {ESTADOS.map((s) => <option key={s} value={s}>{STATUS_CHAMADO[s].label}</option>)}
          </select>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} aria-label="Filtrar por tipo" className={sel}>
            <option value="">Todos os tipos</option>
            <option value="erro">{TIPO_CHAMADO.erro}</option>
            <option value="luta_nao_encontrada">{TIPO_CHAMADO.luta_nao_encontrada}</option>
          </select>
          <span className="text-base text-zinc-300">{emAberto} em aberto</span>
        </div>

        <Card className="mt-4 p-0 sm:overflow-x-auto">
          {!linhas ? (
            <p className="p-5 text-base text-zinc-400">Carregando…</p>
          ) : linhas.length === 0 ? (
            <p className="p-5 text-base text-zinc-300">Nenhum chamado por aqui. Quando um aluno avisar um problema, ele aparece nesta fila.</p>
          ) : (
            <table className="block w-full text-left text-base sm:table">
              <thead className="hidden text-sm text-zinc-400 sm:table-header-group">
                <tr><th className="p-4">Aluno</th><th className="p-4">Chamado</th><th className="p-4">Status</th><th className="p-4">Ações</th></tr>
              </thead>
              <tbody className="block sm:table-row-group">
                {linhas.map((c) => (
                  <Fragment key={c.id}>
                    <tr className="block border-t border-zinc-800 align-top sm:table-row">
                      <td className="block px-4 py-2 sm:table-cell sm:p-4"><div className="text-zinc-100">{c.atleta?.nome ?? '—'}</div><div className="text-sm text-zinc-400">{c.atleta?.email}</div></td>
                      <td className="block px-4 py-2 sm:table-cell sm:p-4">
                        <div className="font-semibold text-white">{TIPO_CHAMADO[c.tipo]}{c.tela ? ` · ${c.tela}` : ''}</div>
                        <div className="text-zinc-300">{c.texto.length > 90 ? `${c.texto.slice(0, 90)}…` : c.texto}</div>
                        <div className="text-sm text-zinc-400">{dataHora(c.criadoEm)}</div>
                      </td>
                      <td className="block px-4 py-2 sm:table-cell sm:p-4"><span className={cn('rounded-full border px-3 py-1 text-sm font-medium', STATUS_CHAMADO[c.status].cor)}>{STATUS_CHAMADO[c.status].label}</span></td>
                      <td className="block px-4 py-2 sm:table-cell sm:p-4">
                        <div className="flex flex-wrap gap-2">
                          <select value={c.status} onChange={(e) => void salvar(c.id, { status: e.target.value as ChamadoStatus })} aria-label="Mudar status" className={sel}>
                            {STATUS_DO_TIPO[c.tipo].map((s) => <option key={s} value={s}>{STATUS_CHAMADO[s].label}</option>)}
                          </select>
                          <Button type="button" variant="secondary" onClick={() => void abrir(c)}>{aberto === c.id ? 'Fechar' : 'Abrir'}</Button>
                        </div>
                      </td>
                    </tr>
                    {aberto === c.id && (
                      <tr className="block bg-surface-raised/50 sm:table-row">
                        <td colSpan={4} className="block p-5 sm:table-cell">
                          <p className="whitespace-pre-wrap text-base text-zinc-100">{c.texto}</p>
                          {c.extra && (
                            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-base sm:grid-cols-3">
                              {Object.entries(c.extra).filter(([, v]) => v !== null && v !== '').map(([k, v]) => (
                                <div key={k}><dt className="text-sm text-zinc-400">{ROTULO_EXTRA[k] ?? k}</dt><dd className="text-zinc-100">{v === true ? 'Sim' : String(v)}</dd></div>
                              ))}
                            </dl>
                          )}
                          {print && <img src={print} alt="Print enviado pelo aluno" className="my-3 max-w-xs rounded-lg border border-zinc-700" />}
                          <label htmlFor={`r-${c.id}`} className="mt-4 block text-base font-medium text-zinc-200">Resposta ao aluno</label>
                          <textarea id={`r-${c.id}`} rows={3} maxLength={1000} value={resposta} onChange={(e) => setResposta(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-zinc-700 bg-surface px-4 py-3 text-base text-zinc-100" />
                          <Button type="button" className="mt-3" onClick={() => void salvar(c.id, { resposta: resposta.trim() || null })}>Enviar resposta</Button>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
