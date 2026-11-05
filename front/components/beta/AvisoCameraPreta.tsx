'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { BETA_GRATUITO } from '@/lib/config/beta';

const TITULO = 'Antes de lutar, olhe para a câmera preta.';
const LINHA_2 = '2 segundos, rosto sério.';
const LINHA_3 = 'Sem sorrir. Sem mão, cabelo ou boné na frente do rosto.';
const CHAVE_VISTO = 'beta_aviso_camera_visto_v1';

function useMovimentoReduzido(): boolean {
  const [reduzido, setReduzido] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduzido(mq.matches);
    const f = () => setReduzido(mq.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  return reduzido;
}

/** Animação de 4 s em loop, sem som; com "reduzir movimento" mostra só o quadro final. */
function Animacao({ className }: { className?: string }) {
  const reduzido = useMovimentoReduzido();
  const ref = useRef<HTMLVideoElement>(null);
  if (reduzido) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/beta/aviso-camera-preta-poster.jpg" alt="O rosto do atleta, de frente e sério, reconhecido pela câmera preta" className={className} />
    );
  }
  return (
    <video
      ref={ref}
      className={className}
      autoPlay muted loop playsInline preload="auto"
      poster="/beta/aviso-camera-preta-poster.jpg"
      aria-label="Animação: o atleta no tatame olha para a câmera preta, ela enquadra o rosto e aparece o sinal de certo"
    >
      <source src="/beta/aviso-camera-preta.webm" type="video/webm" />
      <source src="/beta/aviso-camera-preta.mp4" type="video/mp4" />
    </video>
  );
}

// Fotos de um atleta gerado (não é aluno: rosto é dado biométrico). Fonte em design/beta-camera/fotos/.
const PAINEIS = [
  { foto: 'certo', legenda: 'Certo', ok: true, alt: 'Certo: rosto de frente, sério, olhando a câmera' },
  { foto: 'sorrindo', legenda: 'Sorrindo', ok: false, alt: 'Errado: sorrindo' },
  { foto: 'coberto', legenda: 'Rosto coberto', curta: 'Coberto', ok: false, alt: 'Errado: boné, mão e toalha na frente do rosto' },
] as const;

function Paineis() {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-zinc-400">Assim a câmera preta vê você:</p>
      <ul className="grid grid-cols-3 gap-2 sm:gap-3">
        {PAINEIS.map((p) => (
          <li key={p.foto}>
            <div className={`relative overflow-hidden rounded-xl border-2 ${p.ok ? 'border-[#2BB673]' : 'border-[#E03A3A]'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/beta/aviso-${p.foto}.jpg`} alt={p.alt} width={480} height={600} loading="lazy" className="block aspect-[4/5] w-full object-cover" />
              <span aria-hidden className={`absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-white sm:h-8 sm:w-8 ${p.ok ? 'bg-[#2BB673]' : 'bg-[#E03A3A]'}`}>
                {p.ok ? <Check className="h-4 w-4" strokeWidth={3.5} /> : <X className="h-4 w-4" strokeWidth={3.5} />}
              </span>
            </div>
            <p className="mt-1.5 text-center text-sm font-semibold text-zinc-200 sm:text-base">
              {'curta' in p ? (<><span className="sm:hidden">{p.curta}</span><span className="hidden sm:inline">{p.legenda}</span></>) : p.legenda}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Texto({ grande = false }: { grande?: boolean }) {
  return (
    <div>
      <p className={`text-balance font-extrabold leading-tight text-white ${grande ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>{TITULO}</p>
      <p className="mt-2 text-lg font-semibold text-white">{LINHA_2}</p>
      <p className="mt-1 text-base text-zinc-300">{LINHA_3}</p>
    </div>
  );
}

/** Faixa fixa no topo de "Biblioteca" e "Minha luta": mostra o certo e o errado. */
export function AvisoCameraPretaBanner() {
  return (
    <section aria-label="Aviso: olhe para a câmera preta" className="mb-6 overflow-hidden rounded-2xl border border-zinc-800 bg-[#0A0A0C]">
      <div className="grid items-center gap-5 p-5 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <Texto />
        <Paineis />
      </div>
    </section>
  );
}

/** Boas-vindas do beta: abre uma vez, dá para fechar, lembra no navegador (com try/catch: pode estar bloqueado). */
export function AvisoCameraPretaBoasVindas() {
  const [aberto, setAberto] = useState(false);
  useEffect(() => {
    try {
      if (window.localStorage.getItem(CHAVE_VISTO) !== '1') setAberto(true);
    } catch {
      setAberto(true);
    }
  }, []);
  useEffect(() => {
    if (!aberto) return;
    const fechaComEsc = (e: KeyboardEvent) => e.key === 'Escape' && fechar();
    window.addEventListener('keydown', fechaComEsc);
    return () => window.removeEventListener('keydown', fechaComEsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto]);

  const fechar = () => {
    setAberto(false);
    try {
      window.localStorage.setItem(CHAVE_VISTO, '1');
    } catch {
      /* sem armazenamento: o aviso volta na próxima visita, sem problema */
    }
  };

  if (!BETA_GRATUITO || !aberto) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4" onClick={fechar}>
      <div
        role="dialog" aria-modal="true" aria-labelledby="aviso-camera-titulo"
        onClick={(e) => e.stopPropagation()}
        className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-700 bg-[#0A0A0C]"
      >
        <div className="flex items-center justify-between px-5 pt-4">
          <span className="rounded-full bg-[#B71E25] px-3 py-1 text-sm font-bold uppercase tracking-wider text-white">Beta gratuito</span>
          <button onClick={fechar} aria-label="Fechar aviso" className="rounded-lg p-2 text-zinc-300 hover:bg-zinc-800 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <Animacao className="mt-3 aspect-video w-full bg-black object-cover" />
        <div className="p-5">
          <h2 id="aviso-camera-titulo" className="sr-only">Antes de lutar</h2>
          <Texto grande />
          <button onClick={fechar} className="mt-5 h-12 w-full rounded-xl bg-red-600 text-base font-semibold text-white hover:bg-red-500">Entendi</button>
        </div>
      </div>
    </div>
  );
}
