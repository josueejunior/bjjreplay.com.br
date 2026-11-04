/**
 * Chamados: "Reportar erro" do aluno e "Minha luta não foi encontrada".
 * Um só livro, dois tipos, para o admin ver tudo numa fila. Sem dado sensível:
 * o contato é o próprio cadastro (user_id), nunca um campo digitado.
 */
import { randomUUID } from 'node:crypto';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { db } from './db.js';

export type ChamadoTipo = 'erro' | 'luta_nao_encontrada' | 'problema_luta';

/** Opções de "Relatar um problema" (Lucas, 04/11/2026). */
export const OPCOES_PROBLEMA = ['nao_sou_eu', 'comeca_comigo_termina_com_outro', 'corte_errado'] as const;
export type ChamadoStatus =
  | 'recebido' | 'vendo' | 'resolvido' // erro no site
  | 'procurando' | 'encontrada' | 'nao_encontrada'; // luta não encontrada

export const CHAMADO_TIPOS: ChamadoTipo[] = ['erro', 'luta_nao_encontrada', 'problema_luta'];
export const CHAMADO_STATUS: ChamadoStatus[] = [
  'recebido', 'vendo', 'resolvido', 'procurando', 'encontrada', 'nao_encontrada',
];

/** Estados válidos por tipo: o aluno nunca vê "vendo" numa luta, nem "procurando" num erro. */
export const STATUS_DO_TIPO: Record<ChamadoTipo, ChamadoStatus[]> = {
  erro: ['recebido', 'vendo', 'resolvido'],
  luta_nao_encontrada: ['recebido', 'procurando', 'encontrada', 'nao_encontrada'],
  problema_luta: ['recebido', 'vendo', 'resolvido'],
};

const PRINTS_DIR = join(process.cwd(), 'data', 'chamados');
mkdirSync(PRINTS_DIR, { recursive: true });

db.exec(`
  CREATE TABLE IF NOT EXISTS chamados (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tipo        TEXT NOT NULL,
    tela        TEXT,
    texto       TEXT NOT NULL,
    extra       TEXT,
    print_file  TEXT,
    status      TEXT NOT NULL DEFAULT 'recebido',
    resposta    TEXT,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_chamados_user ON chamados(user_id, created_at);
  CREATE INDEX IF NOT EXISTS idx_chamados_status ON chamados(status, created_at);
`);

interface Linha {
  id: string; user_id: string; tipo: ChamadoTipo; tela: string | null; texto: string;
  extra: string | null; print_file: string | null; status: ChamadoStatus;
  resposta: string | null; created_at: string; updated_at: string;
}

export function toChamado(l: Linha) {
  return {
    id: l.id,
    tipo: l.tipo,
    tela: l.tela,
    texto: l.texto,
    extra: l.extra ? (JSON.parse(l.extra) as Record<string, unknown>) : null,
    temPrint: Boolean(l.print_file),
    status: l.status,
    resposta: l.resposta,
    criadoEm: l.created_at,
    atualizadoEm: l.updated_at,
  };
}

const EXT: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };

/** Aceita data URL png/jpeg/webp até ~1,5 MB; devolve o nome do arquivo ou null. */
function guardarPrint(id: string, dataUrl: string | null | undefined): string | null {
  if (!dataUrl) return null;
  const m = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!m) throw Object.assign(new Error('O print precisa ser PNG, JPG ou WebP'), { statusCode: 400 });
  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > 1_500_000) {
    throw Object.assign(new Error('O print passa de 1,5 MB'), { statusCode: 400 });
  }
  const nome = `${id}.${EXT[m[1]]}`;
  writeFileSync(join(PRINTS_DIR, nome), buf);
  return nome;
}

export function criarChamado(i: {
  userId: string; tipo: ChamadoTipo; tela?: string | null; texto: string;
  extra?: Record<string, unknown> | null; printDataUrl?: string | null;
}) {
  const id = randomUUID();
  const agora = new Date().toISOString();
  const print = guardarPrint(id, i.printDataUrl);
  db.prepare(
    `INSERT INTO chamados (id,user_id,tipo,tela,texto,extra,print_file,status,created_at,updated_at)
     VALUES (?,?,?,?,?,?,?, 'recebido', ?, ?)`,
  ).run(id, i.userId, i.tipo, i.tela ?? null, i.texto, i.extra ? JSON.stringify(i.extra) : null, print, agora, agora);
  return chamadoPorId(id)!;
}

export function chamadoPorId(id: string): Linha | undefined {
  return db.prepare('SELECT * FROM chamados WHERE id = ?').get(id) as Linha | undefined;
}

export function chamadosDo(userId: string) {
  return (db.prepare('SELECT * FROM chamados WHERE user_id = ? ORDER BY created_at DESC LIMIT 100').all(userId) as Linha[]).map(toChamado);
}

export function todosChamados(filtro: { status?: ChamadoStatus; tipo?: ChamadoTipo }) {
  const rows = db.prepare(
    `SELECT c.*, u.name AS u_name, u.email AS u_email FROM chamados c
     LEFT JOIN users u ON u.id = c.user_id
     WHERE (@status IS NULL OR c.status = @status) AND (@tipo IS NULL OR c.tipo = @tipo)
     ORDER BY CASE c.status WHEN 'recebido' THEN 0 WHEN 'vendo' THEN 1 ELSE 2 END, c.created_at DESC
     LIMIT 500`,
  ).all({ status: filtro.status ?? null, tipo: filtro.tipo ?? null }) as (Linha & { u_name: string | null; u_email: string | null })[];
  return rows.map((r) => ({
    ...toChamado(r),
    atleta: r.u_name ? { id: r.user_id, nome: r.u_name, email: r.u_email ?? '' } : null,
  }));
}

export function atualizarChamado(id: string, patch: { status?: ChamadoStatus; resposta?: string | null }) {
  const atual = chamadoPorId(id);
  if (!atual) return null;
  db.prepare('UPDATE chamados SET status = ?, resposta = ?, updated_at = ? WHERE id = ?').run(
    patch.status ?? atual.status,
    patch.resposta === undefined ? atual.resposta : patch.resposta,
    new Date().toISOString(),
    id,
  );
  return chamadoPorId(id)!;
}

export function lerPrint(l: Linha): { buf: Buffer; tipo: string } | null {
  if (!l.print_file) return null;
  const caminho = join(PRINTS_DIR, l.print_file);
  if (!existsSync(caminho)) return null;
  const ext = l.print_file.split('.').pop()!;
  return { buf: readFileSync(caminho), tipo: ext === 'jpg' ? 'image/jpeg' : `image/${ext}` };
}
