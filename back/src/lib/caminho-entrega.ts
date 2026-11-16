/**
 * Caminho do vídeo do Mac no R2, montado pelo site (Lucas 16/11/2026):
 *   bjj-replay/<academia>/<atletaId>/<data>_<hora>_<luta>_v<versao>.mp4
 * Um arquivo na pasta de cada atleta, fora da pasta "campeonato". O Mac usa o caminho que o site devolver.
 */
import { config } from '../config.js';
import { db } from './db.js';

/** Data e hora de Brasília, que é o relógio do evento: `2026-11-16` e `1830`. */
function dataHoraBrasilia(quando: Date): { data: string; hora: string } {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(quando)
      .map((p) => [p.type, p.value]),
  );
  return { data: `${partes.year}-${partes.month}-${partes.day}`, hora: `${partes.hour}${partes.minute}` };
}

/** Só `a-z0-9-`: o rótulo da luta vem do Mac e vira nome de arquivo. */
function slug(valor: string): string {
  return (
    valor
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'luta'
  );
}

/** Próxima versão da luta do atleta: 1 na primeira entrega; as antigas sem versão contam como 1. */
export function proximaVersao(atletaId: string, luta: string | null): number {
  const r = db
    .prepare('SELECT MAX(COALESCE(versao, 1)) AS v FROM biblioteca_lutas WHERE aluno_id = ? AND match_label IS ?')
    .get(atletaId, luta) as { v: number | null };
  return (r.v ?? 0) + 1;
}

/** Versão escrita no nome do arquivo (`_v2.mp4`, ou `-v1-lite.mp4` do caminho antigo do Mac). */
export function versaoDoObjectKey(objectKey: string): number | null {
  const m = /[_-]v(\d+)(?:-[a-z]+)?\.[a-z0-9]+$/i.exec(objectKey);
  return m ? Number(m[1]) : null;
}

export function montarObjectKey(atletaId: string, luta: string, versao: number, gravadoEm = new Date()): string {
  const { data, hora } = dataHoraBrasilia(gravadoEm);
  return `bjj-replay/${config.r2PastaAcademia}/${atletaId}/${data}_${hora}_${slug(luta)}_v${versao}.mp4`;
}
