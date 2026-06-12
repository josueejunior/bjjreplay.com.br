import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { seedData, buildDemoAtletaUser, DEMO_ATLETA_EMAIL } from '../data/seed.js';
import { ensureDemoFotos } from '../data/fotos.seed.js';
import type { AdminImage, GamificationProfile, User } from '../types.js';

const DATA_DIR = join(process.cwd(), 'data');
mkdirSync(DATA_DIR, { recursive: true });

export const db = new Database(join(DATA_DIR, 'volt.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
    name          TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    avatar_url    TEXT,
    sport_level   TEXT NOT NULL DEFAULT 'iniciante',
    plan          TEXT NOT NULL DEFAULT 'free',
    is_admin      INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT NOT NULL,
    belt          TEXT NOT NULL DEFAULT 'branca',
    degree        INTEGER NOT NULL DEFAULT 0,
    weight_kg     REAL,
    academy_name  TEXT,
    role          TEXT NOT NULL DEFAULT 'atleta'
  );

  CREATE TABLE IF NOT EXISTS gamification (
    user_id          TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    xp               INTEGER NOT NULL DEFAULT 0,
    streak_days      INTEGER NOT NULL DEFAULT 0,
    total_videos     INTEGER NOT NULL DEFAULT 0,
    total_minutes    INTEGER NOT NULL DEFAULT 0,
    weekly_rank      INTEGER NOT NULL DEFAULT 99,
    earned_badge_ids TEXT NOT NULL DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS admin_images (
    id          TEXT PRIMARY KEY,
    image_url   TEXT NOT NULL,
    uploaded_at TEXT NOT NULL,
    uploaded_by TEXT NOT NULL,
    category    TEXT
  );

  CREATE TABLE IF NOT EXISTS biblioteca_lutas (
    id_luta               INTEGER PRIMARY KEY,
    aluno_id              TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status                TEXT NOT NULL DEFAULT 'PENDENTE',
    url_horizontal        TEXT,
    url_reels_vertical    TEXT,
    data                  TEXT NOT NULL,
    queued_at             TEXT NOT NULL,
    processing_started_at TEXT,
    include_reels         INTEGER NOT NULL DEFAULT 0,
    opponent_name         TEXT,
    opponent_belt         TEXT,
    event_name            TEXT,
    event_city            TEXT,
    belt_at_fight         TEXT,
    category              TEXT
  );

  CREATE TABLE IF NOT EXISTS biblioteca_fotos (
    id_foto     INTEGER PRIMARY KEY,
    aluno_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    url         TEXT NOT NULL,
    data        TEXT NOT NULL,
    caption     TEXT,
    event_name  TEXT,
    id_luta     INTEGER
  );
`);

// ---- Migrações incrementais ----

function ensureColumn(table: string, column: string, definition: string) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${definition}`);
  }
}

ensureColumn('users', 'belt', "belt TEXT NOT NULL DEFAULT 'branca'");
ensureColumn('users', 'degree', 'degree INTEGER NOT NULL DEFAULT 0');
ensureColumn('users', 'weight_kg', 'weight_kg REAL');
ensureColumn('users', 'academy_name', 'academy_name TEXT');
ensureColumn('users', 'role', "role TEXT NOT NULL DEFAULT 'atleta'");
ensureColumn('users', 'athlete_category', "athlete_category TEXT NOT NULL DEFAULT 'adulto'");
ensureColumn('users', 'guardian_cpf', 'guardian_cpf TEXT');
ensureColumn('users', 'guardian_name', 'guardian_name TEXT');
ensureColumn('users', 'birth_date', 'birth_date TEXT');
ensureColumn('biblioteca_lutas', 'opponent_name', 'opponent_name TEXT');
ensureColumn('biblioteca_lutas', 'opponent_belt', 'opponent_belt TEXT');
ensureColumn('biblioteca_lutas', 'event_name', 'event_name TEXT');
ensureColumn('biblioteca_lutas', 'event_city', 'event_city TEXT');
ensureColumn('biblioteca_lutas', 'belt_at_fight', 'belt_at_fight TEXT');
ensureColumn('biblioteca_lutas', 'category', 'category TEXT');

// ---- Mapeamento row → modelo ----

interface UserRow {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  password_salt: string;
  avatar_url: string | null;
  sport_level: string;
  plan: string;
  is_admin: number;
  created_at: string;
  belt?: string;
  degree?: number;
  weight_kg?: number | null;
  academy_name?: string | null;
  role?: string;
  athlete_category?: string;
  guardian_cpf?: string | null;
  guardian_name?: string | null;
  birth_date?: string | null;
}

interface GamificationRow {
  user_id: string;
  xp: number;
  streak_days: number;
  total_videos: number;
  total_minutes: number;
  weekly_rank: number;
  earned_badge_ids: string;
}

interface AdminImageRow {
  id: string;
  image_url: string;
  uploaded_at: string;
  uploaded_by: string;
  category: string | null;
}

export function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash,
    passwordSalt: row.password_salt,
    avatarUrl: row.avatar_url,
    sportLevel: row.sport_level as User['sportLevel'],
    plan: row.plan as User['plan'],
    isAdmin: row.is_admin === 1,
    createdAt: row.created_at,
    belt: (row.belt ?? 'branca') as User['belt'],
    degree: row.degree ?? 0,
    weightKg: row.weight_kg ?? null,
    academyName: row.academy_name ?? null,
    role: (row.role ?? 'atleta') as User['role'],
    athleteCategory: (row.athlete_category ?? 'adulto') as User['athleteCategory'],
    guardianCpf: row.guardian_cpf ?? null,
    guardianName: row.guardian_name ?? null,
    birthDate: row.birth_date ?? null,
  };
}

export function rowToGamification(row: GamificationRow): GamificationProfile {
  return {
    userId: row.user_id,
    xp: row.xp,
    streakDays: row.streak_days,
    totalVideos: row.total_videos,
    totalMinutes: row.total_minutes,
    weeklyRank: row.weekly_rank,
    earnedBadgeIds: JSON.parse(row.earned_badge_ids) as string[],
  };
}

export function rowToAdminImage(row: AdminImageRow): AdminImage {
  return {
    id: row.id,
    imageUrl: row.image_url,
    uploadedAt: row.uploaded_at,
    uploadedBy: row.uploaded_by,
    category: row.category,
  };
}

export type { UserRow, GamificationRow, AdminImageRow };

// ---- Statements compartilhados ----

export const insertUserStmt = db.prepare(`
  INSERT INTO users (
    id, email, name, password_hash, password_salt, avatar_url, sport_level, plan, is_admin, created_at,
    belt, degree, weight_kg, academy_name, role, athlete_category, guardian_cpf, guardian_name, birth_date
  )
  VALUES (
    @id, @email, @name, @passwordHash, @passwordSalt, @avatarUrl, @sportLevel, @plan, @isAdmin, @createdAt,
    @belt, @degree, @weightKg, @academyName, @role, @athleteCategory, @guardianCpf, @guardianName, @birthDate
  )
`);

export const insertGamificationStmt = db.prepare(`
  INSERT INTO gamification (user_id, xp, streak_days, total_videos, total_minutes, weekly_rank, earned_badge_ids)
  VALUES (@userId, @xp, @streakDays, @totalVideos, @totalMinutes, @weeklyRank, @earnedBadgeIds)
`);

// ---- Seed (somente na primeira execução) ----

const userCount = db.prepare('SELECT COUNT(*) AS n FROM users').get() as { n: number };

if (userCount.n === 0) {
  const seed = seedData();

  const insertImage = db.prepare(`
    INSERT INTO admin_images (id, image_url, uploaded_at, uploaded_by, category)
    VALUES (@id, @imageUrl, @uploadedAt, @uploadedBy, @category)
  `);

  db.transaction(() => {
    for (const user of seed.users) {
      insertUserStmt.run({
        ...user,
        isAdmin: user.isAdmin ? 1 : 0,
        role: user.role,
        athleteCategory: user.athleteCategory ?? 'adulto',
        guardianCpf: user.guardianCpf ?? null,
        guardianName: user.guardianName ?? null,
        birthDate: user.birthDate ?? null,
      });
    }
    for (const profile of seed.gamification) {
      insertGamificationStmt.run({
        ...profile,
        earnedBadgeIds: JSON.stringify(profile.earnedBadgeIds),
      });
    }
    for (const image of seed.adminImages) {
      insertImage.run(image);
    }
  })();
} else {
  // Sem seed automático de biblioteca para usuários existentes —
  // replays só entram quando forem registrados/enviados de fato.
}

const demoAtletaMissing = db
  .prepare('SELECT id FROM users WHERE email = ? COLLATE NOCASE')
  .get(DEMO_ATLETA_EMAIL) as { id: string } | undefined;

if (!demoAtletaMissing) {
  const demoAtleta = buildDemoAtletaUser();
  db.transaction(() => {
    insertUserStmt.run({ ...demoAtleta, isAdmin: 0, role: demoAtleta.role, athleteCategory: 'adulto', guardianCpf: null, guardianName: null, birthDate: null });
    insertGamificationStmt.run({
      userId: demoAtleta.id,
      xp: 0,
      streakDays: 0,
      totalVideos: 0,
      totalMinutes: 0,
      weeklyRank: 999,
      earnedBadgeIds: '[]',
    });
  })();
}

ensureDemoFotos();
