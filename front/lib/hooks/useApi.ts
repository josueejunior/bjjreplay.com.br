'use client';

import { useCallback, useEffect, useState } from 'react';
import { isAxiosError } from 'axios';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  status: number | null;
}

export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = [], enabled = true) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: enabled,
    error: null,
    status: null,
  });

  const load = useCallback(async () => {
    if (!enabled) {
      setState({ data: null, loading: false, error: null, status: null });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetcher();
      setState({ data, loading: false, error: null, status: 200 });
    } catch (err) {
      const status = isAxiosError(err) ? err.response?.status ?? null : null;
      const message = isAxiosError(err)
        ? err.response?.data?.detail ?? err.message
        : 'Erro inesperado';
      setState({ data: null, loading: false, error: message, status });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, refetch: load };
}
