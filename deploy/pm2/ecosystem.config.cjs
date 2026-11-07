const path = require('path');

const root = path.resolve(__dirname, '../..');

module.exports = {
  apps: [
    {
      name: 'bjj-replay-back',
      cwd: path.join(root, 'back'),
      script: 'dist/server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.BACK_PORT || '7871',
        JWT_SECRET: process.env.JWT_SECRET || 'troque-este-segredo-em-producao',
        CORS_ORIGIN:
          process.env.CORS_ORIGIN || 'https://bjjreplay.com.br,https://www.bjjreplay.com.br',
        SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        USE_SUPABASE: process.env.USE_SUPABASE || 'false',
        // R2 privado (mesmo do campeonato) para a entrega do Mac; valores vêm do ambiente, nunca deste arquivo.
        R2_ENDPOINT: process.env.R2_ENDPOINT || '',
        R2_BUCKET: process.env.R2_BUCKET || '',
        R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || '',
        R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || '',
        SENTRY_DSN: process.env.SENTRY_DSN_BACK || '',
        SENTRY_RELEASE: process.env.SENTRY_RELEASE || '',
      },
    },
    {
      name: 'bjj-replay-front',
      cwd: path.join(root, 'front/.next/standalone'),
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '768M',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.FRONT_PORT || '7870',
        HOSTNAME: '0.0.0.0',
        SENTRY_DSN: process.env.SENTRY_DSN_FRONT || '',
        SENTRY_RELEASE: process.env.SENTRY_RELEASE || '',
      },
    },
  ],
};
