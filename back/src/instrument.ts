import * as Sentry from '@sentry/node';

// Sem SENTRY_DSN (dev, teste) o SDK fica desligado. O DSN vem só do ambiente do servidor.
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });
}
