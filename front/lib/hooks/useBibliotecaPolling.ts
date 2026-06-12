'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { getBiblioteca } from '@/lib/api/endpoints';
import { BIBLIOTECA_POLL_MS, isLutaProcessing } from '@/lib/biblioteca/status';
import type { LutaBiblioteca } from '@/types';

interface BibliotecaState {
  data: LutaBiblioteca[] | null;
  loading: boolean;
  error: string | null;
  isPolling: boolean;
}

/**
 * Busca a biblioteca do aluno e faz polling automático enquanto
 * existir luta com status PENDENTE ou PROCESSANDO.
 * O front nunca bloqueia — só re-renderiza conforme o status muda.
 */
export function useBibliotecaPolling(alunoId: string | undefined, enabled = true) {
  const [state, setState] = useState<BibliotecaState>({
    data: null,
    loading: enabled && Boolean(alunoId),
    error: null,
    isPolling: false,
  });

  const mountedRef = useRef(true);

  const fetchBiblioteca = useCallback(async () => {
    if (!alunoId || !enabled) return;

    try {
      const data = await getBiblioteca(alunoId);
      if (!mountedRef.current) return;

      const isPolling = data.some((luta) => isLutaProcessing(luta.status));
      setState({ data, loading: false, error: null, isPolling });
    } catch (err) {
      if (!mountedRef.current) return;
      const message = isAxiosError(err)
        ? (err.response?.data?.detail ?? err.message)
        : 'Erro ao carregar biblioteca';
      setState((s) => ({ ...s, loading: false, error: message, isPolling: false }));
    }
  }, [alunoId, enabled]);

  useEffect(() => {
    mountedRef.current = true;
    if (!alunoId || !enabled) {
      setState({ data: null, loading: false, error: null, isPolling: false });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));
    fetchBiblioteca();

    return () => {
      mountedRef.current = false;
    };
  }, [alunoId, enabled, fetchBiblioteca]);

  useEffect(() => {
    if (!state.isPolling || !enabled) return;

    const timer = setInterval(fetchBiblioteca, BIBLIOTECA_POLL_MS);
    return () => clearInterval(timer);
  }, [state.isPolling, enabled, fetchBiblioteca]);

  return { ...state, refetch: fetchBiblioteca };
}
