'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

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
      <img src="/beta/aviso-camera-preta-poster.png" alt="Atleta olhando para a câmera preta, com o sinal de certo" className={className} />
    );
  }
  return (
    <video
      ref={ref}
      className={className}
      autoPlay muted loop playsInline preload="auto"
      poster="/beta/aviso-camera-preta-poster.png"
      aria-label="Animação: o atleta chega, olha para a câmera preta e aparece o sinal de certo"
    >
      <source src="/beta/aviso-camera-preta.webm" type="video/webm" />
      <source src="/beta/aviso-camera-preta.mp4" type="video/mp4" />
    </video>
  );
}

function Texto({ grande = false }: { grande?: boolean }) {
  return (
    <div>
      <p className={grande ? 'text-2xl font-extrabold leading-tight text-white sm:text-3xl' : 'text-xl font-extrabold leading-tight text-white sm:text-2xl'}>{TITULO}</p>
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/beta/paineis.svg" alt="Certo: rosto de frente e sério olhando a câmera preta. Errado: sorrindo. Errado: mão, cabelo ou boné na frente do rosto." className="w-full" />
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

  if (!aberto) return null;
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
