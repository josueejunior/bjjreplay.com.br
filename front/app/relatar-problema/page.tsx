'use client';

import { useCallback, useEffect, useState } from 'react';
import { Flag, Loader2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { getMeusChamados, relatarProblema } from '@/lib/api/endpoints';
import { OPCOES_PROBLEMA, ROTULO_OPCAO, STATUS_CHAMADO, dataHora } from '@/lib/chamados-rotulos';
import { cn } from '@/lib/utils/cn';
import type { Chamado } from '@/types';

const campo =
  'w-full rounded-lg border border-zinc-700 bg-surface-raised px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-500 focus:border-red-500 focus:outline-none';

export default function RelatarProblemaPage() {
  const { toast } = useToast();
  const [lista, setLista] = useState<Chamado[] | null>(null);
  const [opcao, setOpcao] = useState('');
  const [luta, setLuta] = useState('');
  const [observacao, setObservacao] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setLista((await getMeusChamados()).filter((c) => c.tipo === 'problema_luta'));
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
      await relatarProblema({ opcao, observacao, luta: luta || null });
      setOpcao(''); setLuta(''); setObservacao('');
      toast('Problema recebido. Vamos conferir a sua luta.');
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
          <Flag className="h-7 w-7 text-neon" /> Relatar um problema
        </h1>
        <p className="mt-2 text-base text-zinc-300">
          O vídeo da sua luta veio errado? Conte o que aconteceu. A resposta aparece aqui, em “Meus relatos”.
        </p>

        <Card className="mt-6">
          <form onSubmit={enviar} className="flex flex-col gap-5">
            {erro && <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-base text-red-200">{erro}</p>}
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-1 text-base font-medium text-zinc-200">O que aconteceu</legend>
              {OPCOES_PROBLEMA.map((o) => (
                <label key={o.valor} className={cn('flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-base text-zinc-100', opcao === o.valor ? 'border-red-500 bg-red-500/10' : 'border-zinc-700 bg-surface-raised')}>
                  <input type="radio" name="opcao" value={o.valor} checked={opcao === o.valor} onChange={() => setOpcao(o.valor)} className="mt-1 h-4 w-4 accent-red-600" required />
                  <span>{o.label}</span>
                </label>
              ))}
            </fieldset>
            <div className="flex flex-col gap-2">
              <label htmlFor="luta" className="text-base font-medium text-zinc-200">Qual luta <span className="text-zinc-400">(opcional)</span></label>
              <input id="luta" type="text" maxLength={120} value={luta} onChange={(e) => setLuta(e.target.value)} className={campo} placeholder="Ex.: luta de 03/11, por volta das 19h40" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="obs" className="text-base font-medium text-zinc-200">Observações</label>
              <textarea id="obs" rows={4} maxLength={500} required minLength={5} value={observacao} onChange={(e) => setObservacao(e.target.value)} className={campo} placeholder="Descreva o que você viu no vídeo." />
              <span className="text-sm text-zinc-400">{observacao.length}/500 · não escreva senha, CPF ou dados de cartão</span>
            </div>
            <Button type="submit" size="lg" disabled={enviando || !opcao || observacao.trim().length < 5}>
              {enviando ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando…</> : 'Enviar relato'}
            </Button>
          </form>
        </Card>

        <h2 className="mt-10 text-xl font-bold text-white">Meus relatos</h2>
        <div className="mt-3 flex flex-col gap-3">
          {lista === null ? (
            <p className="text-base text-zinc-400">Carregando…</p>
          ) : lista.length === 0 ? (
            <Card><p className="text-base text-zinc-300">Você ainda não relatou nenhum problema. Se o vídeo de uma luta vier errado, conte aqui em cima.</p></Card>
          ) : (
            lista.map((c) => {
              const x = (c.extra ?? {}) as Record<string, string | null>;
              return (
                <Card key={c.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-base text-white">{ROTULO_OPCAO[String(x.opcao)] ?? 'Problema na luta'}</strong>
                    <span className={cn('rounded-full border px-3 py-1 text-sm font-medium', STATUS_CHAMADO[c.status].cor)}>{STATUS_CHAMADO[c.status].label}</span>
                  </div>
                  {x.luta && <p className="mt-1 text-sm text-zinc-400">Luta: {x.luta}</p>}
                  <p className="mt-2 text-base text-zinc-200">{c.texto}</p>
                  <p className="mt-1 text-sm text-zinc-400">{dataHora(c.criadoEm)}</p>
                  {c.resposta && <p className="mt-3 rounded-lg border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-base text-sky-100"><strong>Resposta:</strong> {c.resposta}</p>}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}
