'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'sans-serif', padding: 24 }}>
        <h2>Algo deu errado</h2>
        <p>Recarregue a página. Se continuar, avise o suporte.</p>
      </body>
    </html>
  );
}
