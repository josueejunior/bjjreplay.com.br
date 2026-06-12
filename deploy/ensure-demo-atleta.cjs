const { randomUUID, randomBytes, scryptSync } = require('node:crypto');
const Database = require('better-sqlite3');

const dbPath = process.argv[2] || '/app/data/volt.db';
const email = 'atleta@bjjreplay.app';
const password = 'demo123';

function hashPassword(raw) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(raw, salt, 64).toString('hex');
  return { hash, salt };
}

const db = new Database(dbPath);

const existing = db
  .prepare('SELECT id, email, name, role, academy_name FROM users WHERE email = ? COLLATE NOCASE')
  .get(email);

if (existing) {
  console.log('OK_EXISTS');
  console.log(JSON.stringify(existing));
  process.exit(0);
}

const { hash, salt } = hashPassword(password);
const id = randomUUID();
const now = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

db.transaction(() => {
  db.prepare(`
    INSERT INTO users (
      id, email, name, password_hash, password_salt, avatar_url, sport_level, plan, is_admin, created_at,
      belt, degree, weight_kg, academy_name, role
    ) VALUES (?, ?, ?, ?, ?, NULL, 'intermediario', 'free', 0, ?, 'azul', 2, 74, 'Gracie Barra Fortaleza', 'atleta')
  `).run(id, email, 'Atleta Demo', hash, salt, now);

  db.prepare(`
    INSERT INTO gamification (user_id, xp, streak_days, total_videos, total_minutes, weekly_rank, earned_badge_ids)
    VALUES (?, 0, 0, 0, 0, 999, '[]')
  `).run(id);
})();

const created = db
  .prepare('SELECT email, name, role, academy_name FROM users WHERE id = ?')
  .get(id);

console.log('OK_CREATED');
console.log(JSON.stringify(created));
