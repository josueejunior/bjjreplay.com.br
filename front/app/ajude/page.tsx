'use client';

import { useCallback, useEffect, useState } from 'react';
import { HeartHandshake, Loader2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { LutaNaoApareceuModal } from '@/components/biblioteca/LutaNaoApareceuModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import {
  getContagem, getPerguntasCortex, getResumoAjuda, responderContagem, responderPerguntaCortex,
} from '@/lib/api/endpoints';
import { cn } from '@/lib/utils/cn';
import { PERGUNTAS_CORTEX } from '@/lib/config/beta';
import type { DiaContagem, PerguntaCortex, ResultadoContagem, ResumoAjuda } from '@/types';

const campo =
  'w-full rounded-lg border border-zinc-700 bg-surface-raised px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-500 focus:border-red-500 focus:outline-none';

const diaBR = (iso: string) => {
  const [a, m, d] = iso.split('-');
  const sem = new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'long' });
  return `${sem}, ${d}/${m}/${a}`;
};

const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

/** Linha do tempo do trecho: contexto escurecido com borda vermelha, janela de foco em verde. */
function TrechoCortex({ p }: { p: PerguntaCortex }) {
  const total = p.focoFimS + p.contextoS;
  const inicio = Math.max(0, p.focoInicioS - p.contextoS);
  const dur = total - inicio;
  const esq = ((p.focoInicioS - inicio) / dur) * 100;
  const larg = ((p.focoFimS - p.focoInicioS) / dur) * 100;
  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
  return (
    <figure className="mt-3" aria-label={`Trecho da luta de ${mmss(inicio)} a ${mmss(total)}, foco de ${mmss(p.focoInicioS)} a ${mmss(p.focoFimS)}`}>
      <div className="relative aspect-video overflow-hidden rounded-xl border-2 border-red-600 bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1e293b_0%,#020617_75%)]" />
        <span className="absolute left-3 top-3 z-10 rounded bg-black/80 px-2 py-1 text-sm font-medium text-zinc-100">
          Trecho de demonstração da luta
        </span>
        {/* fora da janela de foco: escurecido */}
        <div className="absolute inset-y-0 left-0 bg-black/70" style={{ width: `${esq}%` }} />
        <div className="absolute inset-y-0 right-0 bg-black/70" style={{ width: `${100 - esq - larg}%` }} />
        <div className="absolute inset-y-0 border-x-4 border-emerald-400 bg-emerald-400/10" style={{ left: `${esq}%`, width: `${larg}%` }} />
        <span className="absolute bottom-3 rounded bg-emerald-400 px-2 py-0.5 text-sm font-bold text-black" style={{ left: `${esq}%` }}>
          Trecho verde
        </span>
      </div>
      <figcaption className="mt-2 flex justify-between text-sm text-zinc-300">
        <span>{mmss(inicio)}</span>
        <span className="font-semibold text-emerald-300">foco {mmss(p.focoInicioS)} – {mmss(p.focoFimS)}</span>
        <span>{mmss(total)}</span>
      </figcaption>
    </figure>
  );
}

function CartaoDia({ d, onSalvar, onPedirBusca }: {
  d: DiaContagem;
  onSalvar: (b: { dia: string; encontradas: number; resultado: ResultadoContagem; quantas: number; horarios: string | null }) => Promise<void>;
  onPedirBusca: (d: DiaContagem, faltaram: number) => void;
}) {
  const [resultado, setResultado] = useState<ResultadoContagem | ''>(d.resposta?.resultado ?? '');
  const [quantas, setQuantas] = useState(String(d.resposta?.quantas ?? d.encontradas));
  const [adv, setAdv] = useState(d.resposta?.horarios ?? '');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const feito = Boolean(d.resposta);
  const n = Number(quantas);

  const escolher = (r: ResultadoContagem) => {
    setResultado(r);
    setErro(null);
    if (r === 'certo') setQuantas(String(d.encontradas));
    if (r === 'mais') setQuantas(String(d.encontradas + 1));
    if (r === 'menos') setQuantas(String(Math.max(0, d.encontradas - 1)));
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultado) return;
    setSalvando(true);
    setErro(null);
    try {
      await onSalvar({ dia: d.dia, encontradas: d.encontradas, resultado, quantas: n, horarios: adv.trim() || null });
    } catch (err) {
      setErro((err as { response?: { data?: { detail?: string } } }).response?.data?.detail?.replace(/^: /, '') ?? 'Não consegui salvar. Tente de novo.');
    } finally {
      setSalvando(false);
    }
  };

  const opcoes: { v: ResultadoContagem; t: string }[] = [
    { v: 'certo', t: 'Está certo' },
    { v: 'mais', t: 'Fiz mais' },
    { v: 'menos', t: 'Fiz menos' },
  ];

  return (
    <Card>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-bold text-white">{diaBR(d.dia)}</h3>
        {feito && <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">Respondido</span>}
      </div>
      <p className="mt-1 text-base text-zinc-200">
        O sistema encontrou <strong className="text-white">{plural(d.encontradas, 'luta sua', 'lutas suas')}</strong> neste dia.
      </p>
      <form onSubmit={enviar} className="mt-4 flex flex-col gap-4">
        <div role="radiogroup" aria-label="Está certo?" className="grid gap-2 sm:grid-cols-3">
          {opcoes.map((o) => (
            <button
              key={o.v} type="button" role="radio" aria-checked={resultado === o.v}
              onClick={() => escolher(o.v)}
              className={cn('min-h-12 rounded-lg border px-4 py-3 text-base font-medium', resultado === o.v ? 'border-red-500 bg-red-500/15 text-white' : 'border-zinc-700 bg-surface-raised text-zinc-200 hover:border-zinc-500')}
            >
              {o.t}
            </button>
          ))}
        </div>
        {resultado && resultado !== 'certo' && (
          <div className="flex flex-col gap-2">
            <label htmlFor={`q-${d.dia}`} className="text-base font-medium text-zinc-200">Quantas lutas você fez de verdade?</label>
            <input id={`q-${d.dia}`} type="number" inputMode="numeric" min={0} max={30} value={quantas} onChange={(e) => setQuantas(e.target.value)} className={cn(campo, 'max-w-[8rem]')} />
          </div>
        )}
        {resultado && (
          <div className="flex flex-col gap-2">
            <label htmlFor={`a-${d.dia}`} className="text-base font-medium text-zinc-200">Horário da luta <span className="text-zinc-400">(opcional)</span></label>
            <input id={`a-${d.dia}`} type="text" maxLength={200} value={adv} onChange={(e) => setAdv(e.target.value)} className={campo} placeholder="Ex.: 19:40 e 20:10" />
          </div>
        )}
        {erro && <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-base text-red-200">{erro}</p>}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={!resultado || salvando} className="disabled:bg-none disabled:bg-zinc-800 disabled:text-zinc-300 disabled:opacity-100 disabled:shadow-none">
            {salvando ? <><Loader2 className="h-4 w-4 animate-spin" /> Salvando…</> : feito ? 'Atualizar resposta' : 'Enviar resposta'}
          </Button>
          {!resultado && <span className="self-center text-base text-zinc-300">Escolha uma opção acima.</span>}
          {resultado === 'mais' && n > d.encontradas && (
            <Button type="button" variant="secondary" className="h-auto min-h-11 w-full whitespace-normal py-2 text-base sm:w-auto" onClick={() => onPedirBusca(d, n - d.encontradas)}>
              Pedir que procurem {plural(n - d.encontradas, 'luta que faltou', 'lutas que faltaram')}
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}

export default function AjudePage() {
  const { toast } = useToast();
  const [dias, setDias] = useState<DiaContagem[] | null>(null);
  const [perguntas, setPerguntas] = useState<PerguntaCortex[] | null>(null);
  const [resumo, setResumo] = useState<ResumoAjuda | null>(null);
  const [modal, setModal] = useState<{ aberto: boolean; data?: string; faltaram?: number; chave: number }>({ aberto: false, chave: 0 });

  const carregar = useCallback(async () => {
    const [d, p, r] = await Promise.all([
      getContagem().catch(() => []), getPerguntasCortex().catch(() => []), getResumoAjuda().catch(() => null),
    ]);
    setDias(d); setPerguntas(p); setResumo(r);
  }, []);
  useEffect(() => void carregar(), [carregar]);

  const salvarDia: React.ComponentProps<typeof CartaoDia>['onSalvar'] = async (b) => {
    await responderContagem(b);
    toast('Resposta salva. Obrigado por ajudar!');
    await carregar();
  };

  const responder = async (p: PerguntaCortex, opcao: string) => {
    const r = await responderPerguntaCortex(p.id, opcao).catch(() => null);
    if (r) { setResumo(r); toast(opcao === 'nao_sei' ? 'Tudo bem, anotado.' : 'Resposta salva. Obrigado por ajudar!'); }
    await carregar();
  };

  const cartao = (d: DiaContagem) => (
    <CartaoDia key={`${d.dia}-${d.resposta?.quantas ?? 'n'}`} d={d} onSalvar={salvarDia} onPedirBusca={(x, f) => setModal({ aberto: true, data: x.dia, faltaram: f, chave: modal.chave + 1 })} />
  );
  const comLutas = dias?.filter((d) => d.encontradas > 0 || d.resposta) ?? [];
  const semLutas = dias?.filter((d) => d.encontradas === 0 && !d.resposta) ?? [];
  const abertas = perguntas?.filter((p) => !p.respondida) ?? [];
  const respondidas = perguntas?.filter((p) => p.respondida) ?? [];

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white">
          <HeartHandshake className="h-7 w-7 text-neon" /> Ajude a melhorar
        </h1>
        <p className="mt-2 text-base text-zinc-300">
          Uma tarefa curta, depois da aula. Suas respostas ajudam a medir e corrigir o sistema. Nada é obrigatório.
        </p>
        {resumo && (
          <p className="mt-4 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-base font-semibold text-emerald-200">
            Você ajudou em {plural(resumo.lutasAjudadas, 'luta', 'lutas')}
          </p>
        )}

        <h2 className="mt-10 text-2xl font-bold text-white">Quantas lutas você fez?</h2>
        <p className="mt-1 text-base text-zinc-300">Confira os últimos 3 dias e diga se o sistema acertou a contagem.</p>
        <div className="mt-4 flex flex-col gap-4">
          {!dias ? <p className="text-base text-zinc-400">Carregando…</p> : (
            <>
              {comLutas.map((d) => cartao(d))}
              {semLutas.length > 0 && (
                <details className="rounded-xl border border-zinc-800 bg-surface p-5">
                  <summary className="cursor-pointer text-base font-medium text-zinc-100">
                    {plural(semLutas.length, 'dia sem luta encontrada', 'dias sem luta encontrada')}: lutou e não apareceu?
                  </summary>
                  <div className="mt-4 flex flex-col gap-4">{semLutas.map((d) => cartao(d))}</div>
                </details>
              )}
            </>
          )}
        </div>

        {PERGUNTAS_CORTEX && (
          <>
        <h2 className="mt-12 text-2xl font-bold text-white">Perguntas sobre as suas lutas</h2>
        <p className="mt-1 text-base text-zinc-300">
          O sistema marcou um lance e quer saber o que aconteceu. Olhe só o trecho verde. Só você e seu adversário veem a pergunta.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          {!perguntas ? <p className="text-base text-zinc-400">Carregando…</p> : abertas.length === 0 ? (
            <Card><p className="text-base text-zinc-300">Nenhuma pergunta nova por enquanto. Quando o sistema marcar um lance da sua luta, ele aparece aqui.</p></Card>
          ) : abertas.map((p) => (
            <Card key={p.id}>
              <p className="text-base text-zinc-300">Luta de {p.lutaId.replace(/^L-(\d{4})-(\d{2})(\d{2})-(\d{2})h(\d{2})$/, '$3/$2/$1, $4h$5')}</p>
              <TrechoCortex p={p} />
              <p className="mt-4 text-lg font-semibold text-white">{p.pergunta}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {p.opcoes.map((o) => (
                  <button key={o} type="button" onClick={() => void responder(p, o)} className="min-h-12 rounded-lg border border-zinc-700 bg-surface-raised px-4 py-3 text-left text-base font-medium text-zinc-100 hover:border-emerald-400">{o}</button>
                ))}
                <button type="button" onClick={() => void responder(p, 'nao_sei')} className="min-h-12 rounded-lg border border-dashed border-zinc-600 px-4 py-3 text-left text-base text-zinc-200 hover:border-zinc-400">Não sei</button>
              </div>
            </Card>
          ))}
          {respondidas.length > 0 && (
            <p className="text-base text-zinc-400">Você já respondeu {plural(respondidas.length, 'pergunta', 'perguntas')}. Obrigado!</p>
          )}
        </div>
          </>
        )}
      </div>
      <LutaNaoApareceuModal
        key={modal.chave}
        isOpen={modal.aberto}
        onClose={() => setModal((m) => ({ ...m, aberto: false }))}
        inicial={{ data: modal.data, faltaram: modal.faltaram }}
      />
    </AppShell>
  );
}
