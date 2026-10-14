function parseCorsOrigins(): string | string[] {
  const raw = process.env.CORS_ORIGIN;
  if (raw) {
    const list = raw.split(',').map((s) => s.trim()).filter(Boolean);
    return list.length === 1 ? list[0]! : list;
  }
  // Front pode usar 3001 quando 3000 estiver ocupada (Next.js)
  return ['http://localhost:3000', 'http://localhost:3001'];
}

export const config = {
  port: Number(process.env.PORT ?? 8000),
  jwtSecret: process.env.JWT_SECRET ?? 'volt-dev-secret-change-me',
  corsOrigin: parseCorsOrigins(),
  supabaseUrl: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  useSupabase: process.env.USE_SUPABASE !== 'false',
} as const;

export function isSupabaseConfigured(): boolean {
  return Boolean(config.supabaseUrl && config.supabaseServiceKey);
}