'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { USE_MOCKS } from '@/lib/api/client';

// Singleton: garante um único worker.start() mesmo com o
// Strict Mode montando o efeito duas vezes em dev.
let startPromise: Promise<void> | null = null;

function startWorker(): Promise<void> {
  if (!startPromise) {
    startPromise = import('@/mocks/browser').then(({ worker }) =>
      worker.start({ onUnhandledRequest: 'bypass' }).then(() => undefined)
    );
  }
  return startPromise;
}

export function MswProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!USE_MOCKS);

  useEffect(() => {
    if (!USE_MOCKS) return;
    let cancelled = false;
    startWorker().then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-neon" />
      </div>
    );
  }

  return <>{children}</>;
}
