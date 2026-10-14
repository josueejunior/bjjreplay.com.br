#!/usr/bin/env node
/**
 * Testa integração Supabase: auth, REST tables, chaves publishable/secret.
 * Uso no servidor: node deploy/pm2/test-supabase.mjs
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, '../..');
const require = createRequire(resolve(root, 'front/package.json'));
const { createClient } = require('@supabase/supabase-js');
const envPath = resolve(root, '.env');

function loadEnv() {
  const env = {};
  try {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) env[m[1].trim()] = m[2].trim();
    }
  } catch {
    /* ignore */
  }
  return env;
}

const env = { ...process.env, ...loadEnv() };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const tables = [
  'users',
  'profiles',
  'gamification',
  'admin_images',
  'biblioteca_lutas',
  'biblioteca_fotos',
  'plans',
  'videos',
  'badges',
];

async function probeTable(client, table) {
  const { data, error, status } = await client.from(table).select('*').limit(1);
  if (error) {
    return { table, ok: false, status: error.code ?? status, message: error.message };
  }
  return { table, ok: true, rows: data?.length ?? 0, sample: data?.[0] ?? null };
}

async function main() {
  console.log('Supabase URL:', url);
  console.log('---');

  const anon = createClient(url, anonKey);
  const admin = serviceKey ? createClient(url, serviceKey) : null;

  const { data: health, error: healthErr } = await anon.auth.getSession();
  console.log('Auth client:', healthErr ? `WARN ${healthErr.message}` : 'OK (client init)');

  const testEmail = `integration-test-${Date.now()}@bjjreplay.test`;
  const testPass = `Test-${Date.now()}!Aa1`;

  const { data: signUp, error: signUpErr } = await anon.auth.signUp({
    email: testEmail,
    password: testPass,
  });
  if (signUpErr) {
    console.log('Auth signUp:', 'FAIL', signUpErr.message);
  } else {
    console.log('Auth signUp:', 'OK', signUp.user?.id ?? '(pending confirm)');
  }

  if (signUp?.session) {
    const { error: signInErr } = await anon.auth.signInWithPassword({
      email: testEmail,
      password: testPass,
    });
    console.log('Auth signIn:', signInErr ? `FAIL ${signInErr.message}` : 'OK');
  }

  console.log('--- Tables (service role) ---');
  const client = admin ?? anon;
  const results = [];
  for (const table of tables) {
    results.push(await probeTable(client, table));
  }

  for (const r of results) {
    if (r.ok) {
      const cols = r.sample ? Object.keys(r.sample).join(', ') : '(empty)';
      console.log(`  ✓ ${r.table} — ${r.rows} row(s) — cols: ${cols}`);
    } else {
      console.log(`  ✗ ${r.table} — ${r.message}`);
    }
  }

  const okTables = results.filter((r) => r.ok).map((r) => r.table);
  console.log('--- Summary ---');
  console.log(`Accessible tables (${okTables.length}):`, okTables.join(', ') || 'none');
  console.log(
    `Auth integration:`,
    signUpErr ? 'FAILED' : 'OK',
  );

  process.exit(signUpErr && okTables.length === 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
