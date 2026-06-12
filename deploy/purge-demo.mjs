import Database from 'better-sqlite3';

const db = new Database('data/volt.db');

db.transaction(() => {
  db.prepare('DELETE FROM biblioteca_lutas').run();
  db.prepare('DELETE FROM admin_images').run();

  const demoAtleta = db.prepare("SELECT id FROM users WHERE email = 'atleta@bjjreplay.app'").get();
  if (demoAtleta) {
    db.prepare('DELETE FROM gamification WHERE user_id = ?').run(demoAtleta.id);
    db.prepare('DELETE FROM users WHERE id = ?').run(demoAtleta.id);
  }

  db.prepare(`
    UPDATE gamification SET
      xp = 0, streak_days = 0, total_videos = 0, total_minutes = 0,
      weekly_rank = 999, earned_badge_ids = '[]'
    WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@bjjreplay.app')
  `).run();
})();

console.log('Demo data purged from production DB');
