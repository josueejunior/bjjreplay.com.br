/**
 * Tokens de serviço — credencial máquina-a-máquina, separada do login do admin.
 *
 * Existe porque o Mac mini do evento só precisa de duas coisas (ler a lista de
 * atletas e criar a entrega do vídeo), e o `accessToken` do login do admin abre
 * o /admin inteiro: cupons, pagamentos, e-mail e telefone de todos os atletas.
 * Se o Mac for comprometido ou o token vazar de um log, o estrago tem que ficar
 * do tamanho da tarefa.
 *
 * O token é guardado só como hash (SHA-256). Vazando o banco, ninguém consegue
 * remontar o valor original — do mesmo jeito que a senha do atleta.
 */
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { db } from './db.js';

db.exec(`
  CREATE TABLE IF NOT EXISTS service_tokens (
    id           TEXT PRIMARY KEY,
    label        TEXT NOT NULL,
    token_hash   TEXT NOT NULL UNIQUE,
    prefixo      TEXT NOT NULL,
    created_at   TEXT NOT NULL,
    last_used_at TEXT,
    revoked_at   TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_service_tokens_hash ON service_tokens(token_hash);
`);

export interface ServiceTokenRow {
  id: string;
  label: string;
  token_hash: string;
  prefixo: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
}

const agora = () => new Date().toISOString();

/** `svc_` + 32 bytes aleatórios em hex. O prefixo fica visível para identificar. */
function gerarToken(): { valor: string; prefixo: string } {
  const valor = `svc_${randomBytes(32).toString('hex')}`;
  return { valor, prefixo: valor.slice(0, 12) };
}

function hashToken(valor: string): string {
  return createHash('sha256').update(valor, 'utf8').digest('hex');
}

/** Cria um token. O valor em claro sai UMA vez — depois só existe o hash. */
export function criarServiceToken(label: string): { id: string; token: string; prefixo: string } {
  const { valor, prefixo } = gerarToken();
  const id = randomBytes(8).toString('hex');
  db.prepare(
    `INSERT INTO service_tokens (id, label, token_hash, prefixo, created_at)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(id, label, hashToken(valor), prefixo, agora());
  return { id, token: valor, prefixo };
}

export function listarServiceTokens(): ServiceTokenRow[] {
  return db
    .prepare('SELECT * FROM service_tokens ORDER BY created_at DESC')
    .all() as ServiceTokenRow[];
}

export function revogarServiceToken(id: string): boolean {
  const r = db
    .prepare('UPDATE service_tokens SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL')
    .run(agora(), id);
  return r.changes > 0;
}

/**
 * Confere o token recebido no header. Comparação em tempo constante sobre o
 * hash — a busca por igualdade no SQLite já vazaria tempo, então o SELECT é por
 * prefixo e o desempate é `timingSafeEqual`.
 */
export function verificarServiceToken(valor: string | undefined): ServiceTokenRow | null {
  if (!valor || !valor.startsWith('svc_')) return null;
  const alvo = Buffer.from(hashToken(valor), 'hex');
  const candidatos = db
    .prepare('SELECT * FROM service_tokens WHERE prefixo = ? AND revoked_at IS NULL')
    .all(valor.slice(0, 12)) as ServiceTokenRow[];

  for (const row of candidatos) {
    const guardado = Buffer.from(row.token_hash, 'hex');
    if (guardado.length === alvo.length && timingSafeEqual(guardado, alvo)) {
      db.prepare('UPDATE service_tokens SET last_used_at = ? WHERE id = ?').run(agora(), row.id);
      return row;
    }
  }
  return null;
}
