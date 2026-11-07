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
  /** Mesmo R2 privado do campeonato: o Mac sobe o vídeo uma vez e as duas entregas apontam para o objeto. */
  r2Endpoint: process.env.R2_ENDPOINT ?? '',
  r2Bucket: process.env.R2_BUCKET ?? '',
  r2AccessKey: process.env.R2_ACCESS_KEY_ID ?? '',
  r2SecretKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  /** Validade da URL assinada que o aluno recebe para assistir (o player pede a lista de novo ao abrir). */
  mediaTtlSegundos: Number(process.env.MEDIA_TTL ?? 6 * 3600),
} as const;

export function r2Configurado(): boolean {
  return Boolean(config.r2Endpoint && config.r2Bucket && config.r2AccessKey && config.r2SecretKey);
}

export function isSupabaseConfigured(): boolean {
  return Boolean(config.supabaseUrl && config.supabaseServiceKey);
}