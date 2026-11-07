/**
 * Fumaça da rota do Mac no site principal (/api/service/*). Roda num diretório vazio:
 *   USE_SUPABASE=false R2_ENDPOINT=https://x.r2.cloudflarestorage.com R2_BUCKET=b R2_ACCESS_KEY_ID=k \
 *   R2_SECRET_ACCESS_KEY=s npx tsx scripts/fumaca-service.ts
 * Cria token e atleta no volt.db local, entrega uma luta com janela e confere a biblioteca do aluno.
 */
import assert from 'node:assert/strict';
import { buildApp } from '../src/app.js';
import { db } from '../src/lib/db.js';
import { criarServiceToken } from '../src/lib/service-tokens.js';
import { getBibliotecaByAluno } from '../src/services/biblioteca.service.js';

const app = buildApp();
await app.ready();
const { token } = criarServiceToken('fumaca');
const atletaId = 'fumaca-atleta';
db.prepare(
  `INSERT OR IGNORE INTO users (id, email, name, password_hash, password_salt, created_at, role)
   VALUES (?, 'fumaca@x.com', 'Fumaça', 'x', 'x', ?, 'atleta')`,
).run(atletaId, new Date().toISOString());

const h = { 'x-service-token': token };
const semToken = await app.inject({ method: 'GET', url: '/api/service/ping' });
assert.equal(semToken.statusCode, 401);
assert.equal((await app.inject({ method: 'GET', url: '/api/service/ping', headers: h })).statusCode, 200);

const atletas = (await app.inject({ method: 'GET', url: '/api/service/atletas', headers: h })).json();
const achado = atletas.find((a: { atletaId: string }) => a.atletaId === atletaId);
assert.ok(achado && !('email' in achado), 'atleta sem e-mail na lista');

const up = await app.inject({ method: 'POST', url: '/api/service/upload-url', headers: h, payload: { objectKey: 'entregas/t/L1.mp4' } });
assert.equal(up.statusCode, 200);
assert.match(up.json().url, /X-Amz-Signature=/);

const entrega = { atletaId, titulo: 'Treino aberto', luta: 'L1', objectKey: 'entregas/t/L1.mp4', inicio_luta_s: 60, fim_luta_s: 120 };
const e1 = await app.inject({ method: 'POST', url: '/api/service/entregas', headers: h, payload: entrega });
assert.equal(e1.statusCode, 201, e1.body);
const e2 = await app.inject({ method: 'POST', url: '/api/service/entregas', headers: h, payload: { ...entrega, inicio_luta_s: 55 } });
assert.equal(e2.statusCode, 200);
assert.equal(e2.json().jaExistia, true);
const invertida = await app.inject({ method: 'POST', url: '/api/service/entregas', headers: h, payload: { ...entrega, luta: 'L2', inicio_luta_s: 120, fim_luta_s: 60 } });
assert.equal(invertida.statusCode, 400);

const lutas = await getBibliotecaByAluno(atletaId);
assert.equal(lutas.length, 1);
assert.equal(lutas[0]!.inicio_luta_s, 55);
assert.equal(lutas[0]!.fim_luta_s, 120);
assert.match(lutas[0]!.url_horizontal ?? '', /X-Amz-Signature=/);

console.log('FUMACA OK', { id: e1.json().id, url: lutas[0]!.url_horizontal?.slice(0, 60) });
await app.close();
