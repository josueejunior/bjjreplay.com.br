import { db } from '../lib/db.js';
import { normalizeAcademyName } from '../lib/academy.js';
import {
  getBibliotecaByAcademy as sbGetBibliotecaByAcademy,
  getBibliotecaByAluno as sbGetBibliotecaByAluno,
  getFotosByAluno as sbGetFotosByAluno,
  supabaseEnabled,
  userHasPlanBlack as sbUserHasPlanBlack,
} from './supabase-store.service.js';
import { findById } from './user.service.js';
import type { FotoBiblioteca, FotoBibliotecaRow, LutaBiblioteca, LutaBibliotecaRow, LutaStatus, LutaSumidaRelato } from '../types.js';

const CDN_BASE = 'https://cdn.bjjreplay.com.br/videos';
const DEMO_HORIZONTAL =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const DEMO_VERTICAL =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

const PENDENTE_MS = 8_000;
const PROCESSANDO_MS = 12_000;

const selectByAluno = db.prepare(`
  SELECT * FROM biblioteca_lutas WHERE aluno_id = ? ORDER BY data DESC, id_luta DESC
`);

const updateStatus = db.prepare(`
  UPDATE biblioteca_lutas
  SET status = @status,
      processing_started_at = @processingStartedAt,
      url_horizontal = @urlHorizontal,
      url_reels_vertical = @urlReelsVertical
  WHERE id_luta = @idLuta
`);

function resolveCdnUrl(stored: string | null, fallback: string): string | undefined {
  if (!stored) return fallback;
  if (stored.includes('cdn.bjjreplay.com.br')) return fallback;
  return stored;
}

function rowToApi(
  row: LutaBibliotecaRow,
  isBlackPlan: boolean,
  alunoName?: string,
  alunoId?: string,
): LutaBiblioteca {
  const item: LutaBiblioteca = {
    id_luta: row.id_luta,
    status: row.status,
    data: row.data,
    opponent_name: row.opponent_name ?? undefined,
    opponent_belt: (row.opponent_belt as LutaBiblioteca['opponent_belt']) ?? undefined,
    event_name: row.event_name ?? undefined,
    event_city: row.event_city ?? undefined,
    belt_at_fight: (row.belt_at_fight as LutaBiblioteca['belt_at_fight']) ?? undefined,
    category: row.category ?? undefined,
    aluno_name: alunoName,
    aluno_id: alunoId,
  };

  if (row.status === 'ENTREGUE' && row.url_horizontal) {
    item.url_horizontal = resolveCdnUrl(row.url_horizontal, DEMO_HORIZONTAL)!;
    if (isBlackPlan && row.url_reels_vertical) {
      item.url_reels_vertical = resolveCdnUrl(row.url_reels_vertical, DEMO_VERTICAL);
    }
  }

  return item;
}

function advanceRow(row: LutaBibliotecaRow): LutaBibliotecaRow {
  const now = Date.now();
  const queuedAt = new Date(row.queued_at).getTime();

  if (row.status === 'PENDENTE' && now - queuedAt >= PENDENTE_MS) {
    const processingStartedAt = new Date().toISOString();
    updateStatus.run({
      idLuta: row.id_luta,
      status: 'PROCESSANDO',
      processingStartedAt,
      urlHorizontal: null,
      urlReelsVertical: null,
    });
    return { ...row, status: 'PROCESSANDO', processing_started_at: processingStartedAt };
  }

  if (row.status === 'PROCESSANDO' && row.processing_started_at) {
    const startedAt = new Date(row.processing_started_at).getTime();
    if (now - startedAt >= PROCESSANDO_MS) {
      const urlHorizontal = `${CDN_BASE}/replay_${row.id_luta}.mp4`;
      const urlReelsVertical = row.include_reels
        ? `${CDN_BASE}/reels_black_${row.id_luta}.mp4`
        : null;

      updateStatus.run({
        idLuta: row.id_luta,
        status: 'ENTREGUE',
        processingStartedAt: row.processing_started_at,
        urlHorizontal,
        urlReelsVertical,
      });

      return {
        ...row,
        status: 'ENTREGUE',
        url_horizontal: urlHorizontal,
        url_reels_vertical: urlReelsVertical,
      };
    }
  }

  return row;
}

export async function getBibliotecaByAluno(alunoId: string): Promise<LutaBiblioteca[]> {
  if (supabaseEnabled()) return sbGetBibliotecaByAluno(alunoId);

  const isBlackPlan = await userHasPlanBlack(alunoId);
  const rows = selectByAluno.all(alunoId) as LutaBibliotecaRow[];
  return rows.map((row) => rowToApi(advanceRow(row), isBlackPlan));
}

const selectByAcademy = db.prepare(`
  SELECT b.*, u.name AS aluno_name, u.plan AS aluno_plan, u.academy_name AS aluno_academy
  FROM biblioteca_lutas b
  JOIN users u ON u.id = b.aluno_id
  WHERE u.role = 'atleta'
  ORDER BY b.data DESC, b.id_luta DESC
`);

export async function getBibliotecaByAcademy(academyName: string): Promise<LutaBiblioteca[]> {
  if (supabaseEnabled()) return sbGetBibliotecaByAcademy(academyName);

  const target = normalizeAcademyName(academyName);
  const rows = selectByAcademy.all() as (LutaBibliotecaRow & {
    aluno_name: string;
    aluno_plan: string;
    aluno_academy: string | null;
  })[];
  return rows
    .filter((row) => normalizeAcademyName(row.aluno_academy) === target)
    .map((row) => {
      const isBlackPlan = row.aluno_plan === 'black';
      const { aluno_name, aluno_plan: _p, aluno_academy: _a, ...lutaRow } = row;
      return rowToApi(advanceRow(lutaRow), isBlackPlan, aluno_name, row.aluno_id);
    });
}

export async function userHasPlanBlack(alunoId: string): Promise<boolean> {
  if (supabaseEnabled()) return sbUserHasPlanBlack(alunoId);
  const user = await findById(alunoId);
  return user?.plan === 'black';
}

const selectFotosByAluno = db.prepare(`
  SELECT * FROM biblioteca_fotos WHERE aluno_id = ? ORDER BY data DESC, id_foto DESC
`);

export async function getFotosByAluno(alunoId: string): Promise<FotoBiblioteca[]> {
  if (supabaseEnabled()) return sbGetFotosByAluno(alunoId);

  const rows = selectFotosByAluno.all(alunoId) as FotoBibliotecaRow[];
  return rows.map((row) => ({
    id_foto: row.id_foto,
    url: row.url,
    data: row.data,
    caption: row.caption ?? undefined,
    event_name: row.event_name ?? undefined,
    id_luta: row.id_luta ?? undefined,
  }));
}

// ---- Relatos de lutas sumidas ----

const insertLutaSumida = db.prepare(`
  INSERT INTO luta_sumida_relatos (aluno_id, aluno_name, aluno_email, horario_aprox, tatame, adversario, evento, observacao, created_at, status)
  VALUES (@alunoId, @alunoName, @alunoEmail, @horarioAprox, @tatame, @adversario, @evento, @observacao, @createdAt, 'pendente')
`);

const selectLutasSumidas = db.prepare(`
  SELECT * FROM luta_sumida_relatos ORDER BY created_at DESC
`);

export async function relatarLutaSumida(data: {
  aluno_id: string;
  aluno_name: string;
  aluno_email: string;
  horario_aprox: string;
  tatame?: string;
  adversario?: string;
  evento?: string;
  observacao?: string;
}): Promise<LutaSumidaRelato> {
  const createdAt = new Date().toISOString();
  const result = insertLutaSumida.run({
    alunoId: data.aluno_id,
    alunoName: data.aluno_name,
    alunoEmail: data.aluno_email,
    horarioAprox: data.horario_aprox,
    tatame: data.tatame ?? null,
    adversario: data.adversario ?? null,
    evento: data.evento ?? null,
    observacao: data.observacao ?? null,
    createdAt,
  });

  return {
    id: Number(result.lastInsertRowid),
    aluno_id: data.aluno_id,
    aluno_name: data.aluno_name,
    aluno_email: data.aluno_email,
    horario_aprox: data.horario_aprox,
    tatame: data.tatame,
    adversario: data.adversario,
    evento: data.evento,
    observacao: data.observacao,
    created_at: createdAt,
    status: 'pendente',
  };
}

export async function getLutasSumidas(): Promise<LutaSumidaRelato[]> {
  const rows = selectLutasSumidas.all() as {
    id: number;
    aluno_id: string;
    aluno_name: string;
    aluno_email: string;
    horario_aprox: string;
    tatame: string | null;
    adversario: string | null;
    evento: string | null;
    observacao: string | null;
    created_at: string;
    status: string;
  }[];

  return rows.map((row) => ({
    id: row.id,
    aluno_id: row.aluno_id,
    aluno_name: row.aluno_name,
    aluno_email: row.aluno_email,
    horario_aprox: row.horario_aprox,
    tatame: row.tatame ?? undefined,
    adversario: row.adversario ?? undefined,
    evento: row.evento ?? undefined,
    observacao: row.observacao ?? undefined,
    created_at: row.created_at,
    status: row.status as 'pendente' | 'resolvido',
  }));
}

export type { LutaStatus };
