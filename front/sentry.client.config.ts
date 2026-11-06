import * as Sentry from '@sentry/nextjs';

// NEXT_PUBLIC_* é embutido no build: o build no servidor precisa do DSN no ambiente.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
});
