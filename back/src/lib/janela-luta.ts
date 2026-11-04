/**
 * Janela da luta dentro do vídeo entregue (beta, briefing 28/10/2026): o arquivo traz 1 minuto antes e
 * 1 minuto depois da luta detectada, e o Mac manda o deslocamento em segundos. Inteiros >= 0, fim > início.
 */
export interface JanelaLuta {
  inicio_luta_s: number;
  fim_luta_s: number;
}

const inteiroNaoNegativo = (v: unknown): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= 0;

/** Devolve a janela só se os dois campos forem válidos; senão null (o player age como antes). */
export function janelaValida(inicio: unknown, fim: unknown): JanelaLuta | null {
  if (!inteiroNaoNegativo(inicio) || !inteiroNaoNegativo(fim)) return null;
  if (fim <= inicio) return null;
  return { inicio_luta_s: inicio, fim_luta_s: fim };
}

/** Para gravação: lança erro 400 com mensagem clara em vez de descartar em silêncio. */
export function exigirJanela(inicio: unknown, fim: unknown): JanelaLuta {
  const j = janelaValida(inicio, fim);
  if (!j) {
    throw Object.assign(
      new Error('inicio_luta_s e fim_luta_s devem ser inteiros >= 0, com fim maior que o início'),
      { statusCode: 400 },
    );
  }
  return j;
}
