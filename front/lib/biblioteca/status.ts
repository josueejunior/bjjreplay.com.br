import type { LutaStatus } from '@/types';

export const BIBLIOTECA_POLL_MS = Number(
  process.env.NEXT_PUBLIC_BIBLIOTECA_POLL_MS ?? 5000
);

export function isLutaProcessing(status: LutaStatus): boolean {
  return status === 'PENDENTE' || status === 'PROCESSANDO';
}

export function lutaStatusLabel(status: LutaStatus): string {
  switch (status) {
    case 'PENDENTE':
      return 'Na fila';
    case 'PROCESSANDO':
      return 'Renderizando';
    case 'ENTREGUE':
      return 'Pronto';
  }
}

export function lutaStatusDescription(status: LutaStatus): string {
  switch (status) {
    case 'PENDENTE':
      return 'Sua luta entrou na fila. O motor de IA vai iniciar em breve.';
    case 'PROCESSANDO':
      return 'Renderizando replay e analisando os melhores momentos com IA…';
    case 'ENTREGUE':
      return 'Replay disponível para streaming via CDN.';
  }
}
