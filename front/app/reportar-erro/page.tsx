'use client';

import { useCallback, useEffect, useState } from 'react';
import { Flag, Loader2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { getMeusChamados, reportarErro } from '@/lib/api/endpoints';
import { STATUS_CHAMADO, TELAS, TIPO_CHAMADO, dataHora } from '@/lib/chamados-rotulos';
import { cn } from '@/lib/utils/cn';
import type { Chamado } from '@/types';

const campo =
  'w-full rounded-lg border border-zinc-700 bg-surface-raised px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-500 focus:border-red-500 focus:outline-none';

function lerArquivo(f: File): Promise<string> {
  return new Promise((ok, falha) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result));
    r.onerror = () => falha(new Error('Não consegui ler o arquivo'));
    r.readAsDataURL(f);
  });
}

export default function ReportarErroPage() {
  const { toast } = useToast();
  const [lista, setLista] = useState<Chamado[] | null>(null);
  const [texto, setTexto] = useState('');
  const [tela, setTela] = useState('');
  const [print, setPrint] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setLista(await getMeusChamados());
    } catch {
      setLista([]);
    }
  }, []);
  useEffect(() => void carregar(), [carregar]);

  const escolher = async (f: File | undefined) => {
    setErro(null);
    if (!f) return setPrint(null);
    if (f.size > 1_400_000) return setErro('O print passa de 1,4 MB. Tire um print menor.');
    setPrint(await lerArquivo(f));
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      await reportarErro({ texto, tela: tela || null, print });
      setTexto('');
      setTela('');
      setPrint(null);
      toast('Aviso recebido. Acompanhe o andamento abaixo.');
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
          <Flag className="h-7 w-7 text-neon" /> Reportar erro
        </h1>
        <p className="mt-2 text-base text-zinc-300">
          Algo no site deu problema? Conte aqui. A resposta aparece aqui embaixo, em “Meus avisos”.
        </p>

        <Card className="mt-6">
          <form onSubmit={enviar} className="flex flex-col gap-5">
            {erro && (
              <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-base text-red-200">
                {erro}
              </p>
            )}
            <div className="flex flex-col gap-2">
              <label htmlFor="texto" className="text-base font-medium text-zinc-200">O que aconteceu</label>
              <textarea
                id="texto" rows={4} maxLength={1000} required minLength={10}
                value={texto} onChange={(e) => setTexto(e.target.value)} className={campo}
                placeholder="Ex.: toquei em “Assistir” e o vídeo ficou girando sem abrir."
              />
              <span className="text-sm text-zinc-400">{texto.length}/1000 · não escreva senha, CPF ou dados de cartão</span>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="tela" className="text-base font-medium text-zinc-200">Em que tela</label>
              <select id="tela" value={tela} onChange={(e) => setTela(e.target.value)} className={campo}>
                <option value="">Não sei / outra</option>
                {TELAS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="print" className="text-base font-medium text-zinc-200">Print da tela (opcional)</label>
              <input id="print" type="file" accept="image/png,image/jpeg,image/webp"
                onChange={(e) => void escolher(e.target.files?.[0])}
                className="text-base text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-4 file:py-2.5 file:text-base file:text-zinc-100" />
            </div>
            <Button type="submit" size="lg" disabled={enviando || texto.trim().length < 10}>
              {enviando ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando…</> : 'Enviar aviso'}
            </Button>
          </form>
        </Card>

        <h2 className="mt-10 text-xl font-bold text-white">Meus avisos</h2>
        <div className="mt-3 flex flex-col gap-3">
          {lista === null ? (
            <p className="text-base text-zinc-400">Carregando…</p>
          ) : lista.length === 0 ? (
            <Card><p className="text-base text-zinc-300">Você ainda não enviou nenhum aviso. Se algo der errado no site, conte aqui em cima.</p></Card>
          ) : (
            lista.map((c) => (
              <Card key={c.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-base text-white">{TIPO_CHAMADO[c.tipo]}{c.tela ? ` · ${c.tela}` : ''}</strong>
                  <span className={cn('rounded-full border px-3 py-1 text-sm font-medium', STATUS_CHAMADO[c.status].cor)}>
                    {STATUS_CHAMADO[c.status].label}
                  </span>
                </div>
                <p className="mt-2 text-base text-zinc-200">{c.texto}</p>
                <p className="mt-1 text-sm text-zinc-400">{dataHora(c.criadoEm)}</p>
                {c.resposta && (
                  <p className="mt-3 rounded-lg border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-base text-sky-100">
                    <strong>Resposta:</strong> {c.resposta}
                  </p>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
