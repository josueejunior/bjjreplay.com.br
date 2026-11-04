/**
 * "Ajude a melhorar" (beta): o aluno confere quantas lutas o sistema achou e responde perguntas do Córtex.
 * As respostas viram gabarito para medir o sistema. Cada linha tem `id` estável (uuid) e `seq`
 * crescente: o Mac repete a busca com `?desde=<seq>` sem duplicar.
 */
import { randomUUID } from 'node:crypto';
import { db } from './db.js';

/** SQL fixo, sem interpolação de entrada de usuário. */
const SCHEMA_AJUDA = `
  CREATE TABLE IF NOT EXISTS respostas_contagem (
    seq          INTEGER PRIMARY KEY AUTOINCREMENT,
    id           TEXT NOT NULL UNIQUE,
    user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dia          TEXT NOT NULL,
    encontradas  INTEGER NOT NULL,
    resultado    TEXT NOT NULL,
    quantas      INTEGER NOT NULL,
    adversarios  TEXT,
    created_at   TEXT NOT NULL,
    UNIQUE (user_id, dia)
  );

  CREATE TABLE IF NOT EXISTS perguntas_cortex (
    seq               INTEGER PRIMARY KEY AUTOINCREMENT,
    id                TEXT NOT NULL UNIQUE,
    luta_id           TEXT NOT NULL,
    atleta_a          TEXT NOT NULL,
    atleta_b          TEXT NOT NULL,
    contexto_s        INTEGER NOT NULL DEFAULT 15,
    foco_inicio_s     REAL NOT NULL,
    foco_fim_s        REAL NOT NULL,
    pergunta          TEXT NOT NULL,
    opcoes            TEXT NOT NULL,
    created_at        TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS respostas_cortex (
    seq          INTEGER PRIMARY KEY AUTOINCREMENT,
    id           TEXT NOT NULL UNIQUE,
    pergunta_id  TEXT NOT NULL REFERENCES perguntas_cortex(id) ON DELETE CASCADE,
    user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    opcao        TEXT NOT NULL,
    created_at   TEXT NOT NULL,
    UNIQUE (pergunta_id, user_id)
  );
`;

db.exec(SCHEMA_AJUDA);

export type ResultadoContagem = 'certo' | 'mais' | 'menos';

export interface RespostaContagem {
  seq: number; id: string; userId: string; dia: string; encontradas: number;
  resultado: ResultadoContagem; quantas: number; adversarios: string | null; criadaEm: string;
}

interface LinhaContagem {
  seq: number; id: string; user_id: string; dia: string; encontradas: number;
  resultado: ResultadoContagem; quantas: number; adversarios: string | null; created_at: string;
}

const toContagem = (l: LinhaContagem): RespostaContagem => ({
  seq: l.seq, id: l.id, userId: l.user_id, dia: l.dia, encontradas: l.encontradas,
  resultado: l.resultado, quantas: l.quantas, adversarios: l.adversarios, criadaEm: l.created_at,
});

/** Uma resposta por aluno e dia; responder de novo corrige a anterior (mantém id e seq). */
export function salvarContagem(i: {
  userId: string; dia: string; encontradas: number; resultado: ResultadoContagem;
  quantas: number; adversarios?: string | null;
}): RespostaContagem {
  const existente = db.prepare('SELECT * FROM respostas_contagem WHERE user_id = ? AND dia = ?').get(i.userId, i.dia) as LinhaContagem | undefined;
  const agora = new Date().toISOString();
  if (existente) {
    db.prepare('UPDATE respostas_contagem SET encontradas=?, resultado=?, quantas=?, adversarios=? WHERE seq=?')
      .run(i.encontradas, i.resultado, i.quantas, i.adversarios ?? null, existente.seq);
  } else {
    db.prepare(`INSERT INTO respostas_contagem (id,user_id,dia,encontradas,resultado,quantas,adversarios,created_at)
                VALUES (?,?,?,?,?,?,?,?)`)
      .run(randomUUID(), i.userId, i.dia, i.encontradas, i.resultado, i.quantas, i.adversarios ?? null, agora);
  }
  return toContagem(db.prepare('SELECT * FROM respostas_contagem WHERE user_id = ? AND dia = ?').get(i.userId, i.dia) as LinhaContagem);
}

export function contagensDo(userId: string): RespostaContagem[] {
  return (db.prepare('SELECT * FROM respostas_contagem WHERE user_id = ? ORDER BY dia DESC LIMIT 60').all(userId) as LinhaContagem[]).map(toContagem);
}

export function contagensDesde(seq: number, limite = 200): RespostaContagem[] {
  return (db.prepare('SELECT * FROM respostas_contagem WHERE seq > ? ORDER BY seq LIMIT ?').all(seq, limite) as LinhaContagem[]).map(toContagem);
}

/* --------------------------------- Córtex --------------------------------- */

export interface PerguntaCortex {
  id: string; lutaId: string; contextoS: number; focoInicioS: number; focoFimS: number;
  pergunta: string; opcoes: string[]; criadaEm: string; respondida: string | null;
}

interface LinhaPergunta {
  seq: number; id: string; luta_id: string; atleta_a: string; atleta_b: string; contexto_s: number;
  foco_inicio_s: number; foco_fim_s: number; pergunta: string; opcoes: string; created_at: string;
}

export function publicarPergunta(i: {
  lutaId: string; atletaA: string; atletaB: string; focoInicioS: number; focoFimS: number;
  pergunta?: string; opcoes: string[]; contextoS?: number; id?: string;
}) {
  const id = i.id ?? randomUUID();
  db.prepare(`INSERT OR IGNORE INTO perguntas_cortex
    (id,luta_id,atleta_a,atleta_b,contexto_s,foco_inicio_s,foco_fim_s,pergunta,opcoes,created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?)`)
    .run(id, i.lutaId, i.atletaA, i.atletaB, i.contextoS ?? 15, i.focoInicioS, i.focoFimS,
      i.pergunta ?? 'O que aconteceu no trecho verde?', JSON.stringify(i.opcoes), new Date().toISOString());
  return id;
}

/** Só os dois atletas da luta enxergam a pergunta dela. */
export function perguntasDo(userId: string): PerguntaCortex[] {
  const rows = db.prepare(`
    SELECT p.*, r.opcao AS resp FROM perguntas_cortex p
    LEFT JOIN respostas_cortex r ON r.pergunta_id = p.id AND r.user_id = ?
    WHERE p.atleta_a = ? OR p.atleta_b = ?
    ORDER BY p.seq DESC LIMIT 100`).all(userId, userId, userId) as (LinhaPergunta & { resp: string | null })[];
  return rows.map((l) => ({
    id: l.id, lutaId: l.luta_id, contextoS: l.contexto_s, focoInicioS: l.foco_inicio_s, focoFimS: l.foco_fim_s,
    pergunta: l.pergunta, opcoes: JSON.parse(l.opcoes) as string[], criadaEm: l.created_at, respondida: l.resp,
  }));
}

export function perguntaPorId(id: string): LinhaPergunta | undefined {
  return db.prepare('SELECT * FROM perguntas_cortex WHERE id = ?').get(id) as LinhaPergunta | undefined;
}

export function responderPergunta(userId: string, pergunta: LinhaPergunta, opcao: string) {
  const opcoes = JSON.parse(pergunta.opcoes) as string[];
  if (opcao !== 'nao_sei' && !opcoes.includes(opcao)) return null;
  db.prepare(`INSERT INTO respostas_cortex (id,pergunta_id,user_id,opcao,created_at) VALUES (?,?,?,?,?)
              ON CONFLICT(pergunta_id,user_id) DO UPDATE SET opcao = excluded.opcao`)
    .run(randomUUID(), pergunta.id, userId, opcao, new Date().toISOString());
  return opcao;
}

/** "Você ajudou em N lutas": lutas distintas com pergunta respondida (sem "não sei") + dias de contagem conferidos. */
export function resumoAjuda(userId: string) {
  const lutasCortex = (db.prepare(`
    SELECT COUNT(DISTINCT p.luta_id) AS n FROM respostas_cortex r
    JOIN perguntas_cortex p ON p.id = r.pergunta_id WHERE r.user_id = ? AND r.opcao != 'nao_sei'`).get(userId) as { n: number }).n;
  const diasContagem = (db.prepare('SELECT COUNT(*) AS n FROM respostas_contagem WHERE user_id = ?').get(userId) as { n: number }).n;
  return { lutasAjudadas: lutasCortex, diasConferidos: diasContagem };
}

export function respostasCortexDesde(seq: number, limite = 200) {
  return (db.prepare(`
    SELECT r.seq, r.id, r.pergunta_id AS perguntaId, p.luta_id AS lutaId, r.user_id AS userId, r.opcao, r.created_at AS criadaEm
    FROM respostas_cortex r JOIN perguntas_cortex p ON p.id = r.pergunta_id
    WHERE r.seq > ? ORDER BY r.seq LIMIT ?`).all(seq, limite)) as {
    seq: number; id: string; perguntaId: string; lutaId: string; userId: string; opcao: string; criadaEm: string;
  }[];
}
