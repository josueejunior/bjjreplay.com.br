import * as Sentry from '@sentry/nextjs';

// Sem DSN (dev, teste) o SDK fica desligado. O DSN vem só do ambiente do servidor.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  release: process.env.SENTRY_RELEASE,
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
});
