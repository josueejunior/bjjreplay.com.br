'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { Crosshair } from 'lucide-react';
import { formatDuration } from '@/lib/utils/format';

/**
 * Janela da luta dentro do vídeo entregue (beta, briefing 28/10/2026): o arquivo traz 1 min antes e
 * 1 min depois da luta; o Mac manda `inicio_luta_s` e `fim_luta_s`. Sem os dois (ou inválidos), nada muda.
 */
export interface JanelaLutaProps {
  inicioLutaS?: number | null;
  fimLutaS?: number | null;
}

export interface Janela {
  inicio: number;
  fim: number;
}

/** Só aceita inteiros >= 0 com fim > início e, se a duração já é conhecida, dentro dela. */
export function lerJanela(p: JanelaLutaProps, duracao?: number): Janela | null {
  const { inicioLutaS: i, fimLutaS: f } = p;
  if (typeof i !== 'number' || typeof f !== 'number') return null;
  if (!Number.isInteger(i) || !Number.isInteger(f) || i < 0 || f <= i) return null;
  if (duracao && Number.isFinite(duracao) && duracao > 0 && i >= duracao) return null;
  return { inicio: i, fim: f };
}

/** Abre o vídeo já no início da luta, uma vez por arquivo carregado. */
export function useAbrirNaLuta(
  videoRef: RefObject<HTMLVideoElement>,
  janela: Janela | null,
  onSeek: (t: number) => void,
) {
  const feito = useRef(false);
  const aoCarregar = useCallback(
    (el: HTMLVideoElement) => {
      if (feito.current || !janela) return;
      if (janela.inicio < el.duration) {
        el.currentTime = janela.inicio;
        onSeek(janela.inicio);
      }
      feito.current = true;
    },
    [janela, onSeek],
  );
  const reiniciar = useCallback(() => {
    feito.current = false;
  }, []);
  useEffect(() => {
    const el = videoRef.current;
    if (el && el.readyState >= 1) aoCarregar(el);
  }, [aoCarregar, videoRef]);
  return { aoCarregar, reiniciar };
}

/** Faixa destacada sobre a barra de tempo: preenche entre início e fim, com um traço em cada ponta. */
export function FaixaDaLuta({ janela, duracao }: { janela: Janela; duracao: number }) {
  if (!duracao || !Number.isFinite(duracao)) return null;
  const a = Math.min(100, (janela.inicio / duracao) * 100);
  const b = Math.min(100, (janela.fim / duracao) * 100);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 h-0 -translate-y-1/2" data-testid="faixa-luta">
      <div
        className="absolute h-2 -translate-y-1/2 rounded-sm bg-red-500/80"
        style={{ left: `${a}%`, width: `${Math.max(0, b - a)}%` }}
        data-testid="faixa-luta-preenchimento"
      />
      <div className="absolute h-4 w-[3px] -translate-x-1/2 -translate-y-1/2 bg-white" style={{ left: `${a}%` }} data-testid="marca-inicio" />
      <div className="absolute h-4 w-[3px] -translate-x-1/2 -translate-y-1/2 bg-white" style={{ left: `${b}%` }} data-testid="marca-fim" />
    </div>
  );
}

/** Legenda sempre visível (não some com os controles) + botão grande para voltar ao início da luta. */
export function LegendaDaLuta({
  janela,
  onIrParaInicio,
}: {
  janela: Janela;
  onIrParaInicio: () => void;
}) {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3" data-testid="legenda-luta">
      <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-base text-zinc-200">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-3 w-3 rounded-sm bg-red-500" />
          Início da luta <strong className="text-white">{formatDuration(janela.inicio)}</strong>
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-3 w-3 rounded-sm bg-red-500" />
          Fim da luta <strong className="text-white">{formatDuration(janela.fim)}</strong>
        </span>
      </p>
      <button
        type="button"
        onClick={onIrParaInicio}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-red-400/60 bg-red-500/10 px-4 text-base font-semibold text-white transition-colors hover:bg-red-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <Crosshair className="h-5 w-5" aria-hidden="true" />
        Ir para o início da luta
      </button>
    </div>
  );
}
