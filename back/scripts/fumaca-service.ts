/**
 * Fumaça da rota do Mac no site principal (/api/service/*). Roda num diretório vazio:
 *   USE_SUPABASE=false R2_ENDPOINT=https://x.r2.cloudflarestorage.com R2_BUCKET=b R2_ACCESS_KEY_ID=k \
 *   R2_SECRET_ACCESS_KEY=s npx tsx scripts/fumaca-service.ts
 * Cria token e atleta no volt.db local, entrega uma luta com janela e confere a biblioteca do aluno.
 */
import assert from 'node:assert/strict';
import { buildApp } from '../src/app.js';
import { config } from '../src/config.js';
import { db } from '../src/lib/db.js';
import { criarChamado } from '../src/lib/chamados.db.js';
import { criarServiceToken } from '../src/lib/service-tokens.js';
import { getBibliotecaByAluno } from '../src/services/biblioteca.service.js';

const app = buildApp();
await app.ready();
const { token } = criarServiceToken('fumaca');
const atletaId = 'fumaca-atleta';
db.prepare(
  `INSERT OR IGNORE INTO users (id, email, name, password_hash, password_salt, created_at, role, avatar_url)
   VALUES (?, 'fumaca@x.com', 'Fumaça', 'x', 'x', ?, 'atleta', ?)`,
).run(atletaId, new Date().toISOString(), `data:image/jpeg;base64,${Buffer.from('jpeg-falso').toString('base64')}`);

const h = { 'x-service-token': token };
const semToken = await app.inject({ method: 'GET', url: '/api/service/ping' });
assert.equal(semToken.statusCode, 401);
assert.equal((await app.inject({ method: 'GET', url: '/api/service/ping', headers: h })).statusCode, 200);

const atletas = (await app.inject({ method: 'GET', url: '/api/service/atletas', headers: h })).json();
const achado = atletas.find((a: { atletaId: string }) => a.atletaId === atletaId);
assert.ok(achado && !('email' in achado), 'atleta sem e-mail na lista');
assert.equal(achado.fotoUrl, `/api/service/atletas/${atletaId}/foto`);
const foto = await app.inject({ method: 'GET', url: achado.fotoUrl, headers: h });
assert.equal(foto.statusCode, 200);
assert.equal(foto.headers['content-type'], 'image/jpeg');
assert.equal(foto.headers['cache-control'], 'no-store');
assert.equal(foto.body, 'jpeg-falso');
assert.equal((await app.inject({ method: 'GET', url: achado.fotoUrl })).statusCode, 401);

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

criarChamado({ userId: atletaId, tipo: 'problema_luta', tela: 'L1', texto: 'corte errado na luta', extra: { opcao: 'corte_errado', luta: 'L1' } });
const ch = await app.inject({ method: 'GET', url: '/api/service/chamados?tipo=problema_luta', headers: h });
assert.equal(ch.statusCode, 200);
const lista = ch.json();
assert.equal(lista.length, 1);
assert.equal(lista[0].status, 'recebido');
assert.ok(!('atleta' in lista[0]) && !('user_id' in lista[0]) && !('temPrint' in lista[0]), 'sem dado de quem abriu');
assert.ok(!JSON.stringify(lista).includes('fumaca@x.com'), 'sem e-mail');
assert.equal((await app.inject({ method: 'GET', url: '/api/service/chamados' })).statusCode, 401);
assert.equal((await app.inject({ method: 'GET', url: '/api/service/chamados?status=xx', headers: h })).statusCode, 400);

const lutas = await getBibliotecaByAluno(atletaId);
assert.equal(lutas.length, 1);
assert.equal(lutas[0]!.inicio_luta_s, 55);
assert.equal(lutas[0]!.fim_luta_s, 120);
assert.match(lutas[0]!.url_horizontal ?? '', /X-Amz-Signature=/);

// ---- Lucas 16/11: versão na entrega, caminho montado pelo site, vídeo expirado ----
assert.equal(e1.json().versao, 1, 'caminho antigo sem _vN: primeira versão da luta');

// 1. O site monta o caminho na pasta do atleta, com data e hora de Brasília.
const u1 = await app.inject({
  method: 'POST', url: '/api/service/upload-url', headers: h,
  payload: { atletaId, luta: 'L07 Final', gravadoEm: '2026-11-16T21:30:00Z' },
});
assert.equal(u1.statusCode, 200, u1.body);
assert.equal(u1.json().objectKey, `bjj-replay/alliance-parnaiba/${atletaId}/2026-11-16_1830_l07-final_v1.mp4`);
assert.equal(u1.json().versao, 1);
assert.match(u1.json().url, /X-Amz-Signature=/);

// 2. Sem objectKey e sem atleta/luta é 400; atleta inexistente é 404.
assert.equal((await app.inject({ method: 'POST', url: '/api/service/upload-url', headers: h, payload: {} })).statusCode, 400);
assert.equal(
  (await app.inject({ method: 'POST', url: '/api/service/upload-url', headers: h, payload: { atletaId: 'nao-existe', luta: 'L1' } })).statusCode,
  404,
);

// 3. A entrega com o caminho devolvido responde a versão e o caminho.
const v1 = { atletaId, titulo: 'Treino aberto', luta: 'L07 Final', objectKey: u1.json().objectKey };
const ev1 = await app.inject({ method: 'POST', url: '/api/service/entregas', headers: h, payload: v1 });
assert.equal(ev1.statusCode, 201, ev1.body);
assert.deepEqual({ versao: ev1.json().versao, objectKey: ev1.json().objectKey }, { versao: 1, objectKey: v1.objectKey });

// 4. POST repetido não duplica: mesmo id, mesma versão, uma linha só.
const ev1b = await app.inject({ method: 'POST', url: '/api/service/entregas', headers: h, payload: v1 });
assert.equal(ev1b.statusCode, 200);
assert.deepEqual([ev1b.json().id, ev1b.json().versao, ev1b.json().jaExistia], [ev1.json().id, 1, true]);
const linhas = db.prepare('SELECT COUNT(*) AS n FROM biblioteca_lutas WHERE aluno_id = ? AND match_label = ?').get(atletaId, 'L07 Final') as { n: number };
assert.equal(linhas.n, 1);

// 5. Reenvio da mesma luta vira versão 2, em arquivo novo.
const u2 = (await app.inject({ method: 'POST', url: '/api/service/upload-url', headers: h, payload: { atletaId, luta: 'L07 Final', gravadoEm: '2026-11-16T21:30:00Z' } })).json();
assert.equal(u2.versao, 2);
assert.match(u2.objectKey, /_v2\.mp4$/);
const ev2 = await app.inject({ method: 'POST', url: '/api/service/entregas', headers: h, payload: { ...v1, objectKey: u2.objectKey } });
assert.equal(ev2.statusCode, 201);
assert.equal(ev2.json().versao, 2);

// 6. Vídeo expirado: com prazo ligado, entrega velha sai sem URL e marcada; a nova continua tocando. Prazo 0 = nunca.
db.prepare('UPDATE biblioteca_lutas SET queued_at = ? WHERE id_luta = ?').run(new Date(Date.now() - 5 * 86400_000).toISOString(), ev1.json().id);
const cfg = config as { entregaExpiraDias: number };
cfg.entregaExpiraDias = 4;
const comPrazo = await getBibliotecaByAluno(atletaId);
const velha = comPrazo.find((l) => l.id_luta === ev1.json().id)!;
const nova = comPrazo.find((l) => l.id_luta === ev2.json().id)!;
assert.equal(velha.expirado, true);
assert.equal(velha.url_horizontal, undefined);
assert.ok(!nova.expirado && nova.url_horizontal, 'entrega de hoje continua com URL');
cfg.entregaExpiraDias = 0;
assert.ok((await getBibliotecaByAluno(atletaId)).every((l) => !l.expirado), 'prazo 0 não expira nada');

console.log('FUMACA OK', { id: e1.json().id, url: lutas[0]!.url_horizontal?.slice(0, 60), caminho: u1.json().objectKey });
await app.close();
