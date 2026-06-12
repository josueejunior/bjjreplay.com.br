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
      },
    },
  ],
};
