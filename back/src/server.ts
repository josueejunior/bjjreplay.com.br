import { buildApp } from './app.js';
import { config } from './config.js';

const app = buildApp();

app
  .listen({ port: config.port, host: '0.0.0.0' })
  .then(() => {
    app.log.info(`API Volt rodando em http://localhost:${config.port}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
