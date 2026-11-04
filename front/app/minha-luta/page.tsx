'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { getMeusChamados, pedirLutaNaoEncontrada } from '@/lib/api/endpoints';
import { LIMITE_DIAS_LUTA } from '@/lib/config/beta';
import { STATUS_CHAMADO, STATUS_DO_TIPO, dataHora } from '@/lib/chamados-rotulos';
import { cn } from '@/lib/utils/cn';
import type { Chamado } from '@/types';

const campo =
  'w-full rounded-lg border border-zinc-700 bg-surface-raised px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-500 focus:border-red-500 focus:outline-none';
const rotulo = 'text-base font-medium text-zinc-200';

const TATAMES = ['Tatame 1'];
const LIMITE_DIAS = LIMITE_DIAS_LUTA;

const iso = (d: Date) => d.toISOString().slice(0, 10);
const diasAtras = (n: number) => iso(new Date(Date.now() - n * 86_400_000));

export default function MinhaLutaPage() {
  const { toast } = useToast();
  const hoje = useMemo(() => diasAtras(0), []);
  const [lista, setLista] = useState<Chamado[] | null>(null);
  const [data, setData] = useState(hoje);
  const [tatame, setTatame] = useState(TATAMES.length === 1 ? TATAMES[0] : '');
  const [horario, setHorario] = useState('');
  const [adversario, setAdversario] = useState('');
  const [faltaram, setFaltaram] = useState('1');
  const [observacao, setObservacao] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const maisAntiga = diasAtras(LIMITE_DIAS);

  const carregar = useCallback(async () => {
    try {
      const todos = await getMeusChamados();
      setLista(todos.filter((c) => c.tipo === 'luta_nao_encontrada'));
    } catch {
      setLista([]);
    }
  }, []);
  useEffect(() => void carregar(), [carregar]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      await pedirLutaNaoEncontrada({
        data, tatame, horario, adversario: adversario || null,
        faltaram: Number(faltaram), observacao: observacao || null,
      });
      setHorario(''); setAdversario(''); setFaltaram('1'); setObservacao('');
      toast('Pedido recebido. Vamos procurar nas gravações.');
      await carregar();
    } catch (err) {
      const detalhe = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
      setErro(detalhe ?? 'Não consegui enviar. Tente de novo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white">
          <Search className="h-7 w-7 text-neon" /> Minha luta não foi encontrada
        </h1>
        <p className="mt-2 text-base text-zinc-300">
          Lutou e o replay não apareceu? Avise aqui e procuramos de novo nas gravações da academia.
          Informe o dia e o horário aproximado da luta. Dá para pedir a busca de lutas dos últimos {LIMITE_DIAS} dias.
        </p>

        <Card className="mt-6">
          <form onSubmit={enviar} className="flex flex-col gap-5">
            {erro && <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-base text-red-200">{erro}</p>}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="data" className={rotulo}>Dia da luta</label>
                <input id="data" type="date" required min={maisAntiga} max={hoje} value={data} onChange={(e) => setData(e.target.value)} className={campo} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="horario" className={rotulo}>Horário aproximado da luta</label>
                <input id="horario" type="time" required value={horario} onChange={(e) => setHorario(e.target.value)} className={campo} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="tatame" className={rotulo}>Tatame</label>
                <select id="tatame" required value={tatame} onChange={(e) => setTatame(e.target.value)} className={campo}>
                  <option value="">Escolha o tatame</option>
                  {TATAMES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="faltaram" className={rotulo}>Quantas lutas faltaram</label>
                <input id="faltaram" type="number" inputMode="numeric" min={1} max={20} required value={faltaram} onChange={(e) => setFaltaram(e.target.value)} className={campo} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="adv" className={rotulo}>Com quem lutou <span className="text-zinc-400">(opcional)</span></label>
                <input id="adv" type="text" maxLength={80} value={adversario} onChange={(e) => setAdversario(e.target.value)} className={campo} placeholder="Nome de quem treina na academia" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="obs" className={rotulo}>Observação <span className="text-zinc-400">(opcional)</span></label>
              <textarea id="obs" rows={3} maxLength={280} value={observacao} onChange={(e) => setObservacao(e.target.value)} className={campo} />
              <span className="text-sm text-zinc-400">{observacao.length}/280 · não envie documento, telefone ou foto</span>
            </div>
            <Button type="submit" size="lg" disabled={enviando || !tatame || !horario || data < maisAntiga}>
              {enviando ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando…</> : 'Pedir que procurem minha luta'}
            </Button>
          </form>
        </Card>

        <h2 className="mt-10 text-xl font-bold text-white">Meus pedidos</h2>
        <div className="mt-3 flex flex-col gap-3">
          {lista === null ? (
            <p className="text-base text-zinc-400">Carregando…</p>
          ) : lista.length === 0 ? (
            <Card><p className="text-base text-zinc-300">Você ainda não fez nenhum pedido. Se uma luta sua não aparecer na biblioteca, peça aqui em cima.</p></Card>
          ) : (
            lista.map((c) => {
              const passos = STATUS_DO_TIPO.luta_nao_encontrada.filter((s) => s !== 'nao_encontrada' || c.status === 'nao_encontrada').filter((s) => s !== 'encontrada' || c.status !== 'nao_encontrada');
              const x = (c.extra ?? {}) as Record<string, string | number | null>;
              return (
                <Card key={c.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-base text-white">{String(x.data ?? '').split('-').reverse().join('/')} às {String(x.horario ?? '')}</strong>
                    <span className={cn('rounded-full border px-3 py-1 text-sm font-medium', STATUS_CHAMADO[c.status].cor)}>{STATUS_CHAMADO[c.status].label}</span>
                  </div>
                  <p className="mt-1 text-base text-zinc-200">{String(x.tatame ?? '')} · faltaram {String(x.faltaram ?? '?')} luta(s)</p>
                  <ol className="mt-3 flex flex-wrap gap-2 text-sm text-zinc-300" aria-label="Andamento do pedido">
                    {passos.map((s) => (
                      <li key={s} className={cn('rounded-full border px-3 py-1', s === c.status ? STATUS_CHAMADO[s].cor : 'border-zinc-700 text-zinc-400')}>{STATUS_CHAMADO[s].label}</li>
                    ))}
                  </ol>
                  <p className="mt-2 text-sm text-zinc-400">Enviado em {dataHora(c.criadoEm)}</p>
                  {c.resposta && <p className="mt-3 rounded-lg border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-base text-sky-100"><strong>{c.status === 'nao_encontrada' ? 'Motivo:' : 'Resposta:'}</strong> {c.resposta}</p>}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}
