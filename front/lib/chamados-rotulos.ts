import type { ChamadoStatus, ChamadoTipo } from '@/types';

export const STATUS_CHAMADO: Record<ChamadoStatus, { label: string; cor: string }> = {
  recebido: { label: 'Recebido', cor: 'bg-sky-500/10 text-sky-300 border-sky-500/30' },
  vendo: { label: 'Vendo', cor: 'bg-amber-400/10 text-amber-300 border-amber-400/30' },
  resolvido: { label: 'Resolvido', cor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
  procurando: { label: 'Procurando', cor: 'bg-amber-400/10 text-amber-300 border-amber-400/30' },
  encontrada: { label: 'Encontrada', cor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
  nao_encontrada: { label: 'Não encontrada', cor: 'bg-red-500/10 text-red-300 border-red-500/30' },
};

export const TIPO_CHAMADO: Record<ChamadoTipo, string> = {
  erro: 'Erro no site',
  luta_nao_encontrada: 'Luta não encontrada',
};

export const TELAS = ['Dashboard', 'Biblioteca', 'Replay (player)', 'Perfil / cadastro', 'Login', 'Outra'];

export function dataHora(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export const STATUS_DO_TIPO: Record<ChamadoTipo, ChamadoStatus[]> = {
  erro: ['recebido', 'vendo', 'resolvido'],
  luta_nao_encontrada: ['recebido', 'procurando', 'encontrada', 'nao_encontrada'],
};
