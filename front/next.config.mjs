import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: { instrumentationHook: true },
  // O commit sobe como release também no navegador (o servidor lê SENTRY_RELEASE em runtime).
  env: { NEXT_PUBLIC_SENTRY_RELEASE: process.env.SENTRY_RELEASE || '' },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
};

// Sem SENTRY_AUTH_TOKEN não há upload de sourcemaps; só a captura de erros.
export default withSentryConfig(nextConfig, {
  silent: true,
  telemetry: false,
  sourcemaps: { disable: true },
});
