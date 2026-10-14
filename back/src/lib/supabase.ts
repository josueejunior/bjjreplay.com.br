import { config, isSupabaseConfigured } from '../config.js';

const TABLE_NAMES = [
  'alunos',
  'aluno_modalidades',
  'checkins',
  'estatisticas_biomecanicas',
  'faturas_mensalidades',
  'linha_do_tempo_eventos',
  'midia_marcacoes',
  'midias',
  'sessoes_sparring',
  'treinos_gerais',
] as const;

export type SupabaseTable = (typeof TABLE_NAMES)[number];

export const SUPABASE_TABLES: readonly SupabaseTable[] = TABLE_NAMES;

function restUrl(path: string, query?: string): string {
  const q = query ? `?${query}` : '';
  return `${config.supabaseUrl}/rest/v1/${path}${q}`;
}

function restHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    apikey: config.supabaseServiceKey,
    Accept: 'application/json',
    ...extra,
  };
}

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function supabaseFetch<T = unknown>(
  table: SupabaseTable,
  query = 'select=*',
  init: RequestInit = {},
): Promise<{ data: T | null; error: string | null; status: number }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase não configurado', status: 503 };
  }

  const res = await fetch(restUrl(table, query), {
    ...init,
    headers: restHeaders(init.headers as Record<string, string>),
  });

  const body = await parseJson(res);
  if (!res.ok) {
    const msg =
      typeof body === 'object' && body && 'message' in body
        ? String((body as { message: string }).message)
        : `HTTP ${res.status}`;
    return { data: null, error: msg, status: res.status };
  }

  return { data: body as T, error: null, status: res.status };
}

export async function countTable(table: SupabaseTable): Promise<number | null> {
  if (!isSupabaseConfigured()) return null;

  const res = await fetch(restUrl(table, 'select=*'), {
    method: 'HEAD',
    headers: restHeaders({ Prefer: 'count=exact' }),
  });

  if (!res.ok) return null;
  const range = res.headers.get('content-range');
  if (!range) return 0;
  const total = range.split('/')[1];
  return total === '*' ? 0 : Number(total);
}

export async function checkSupabaseHealth(): Promise<{
  configured: boolean;
  authOk: boolean;
  tables: Array<{ table: SupabaseTable; ok: boolean; rows: number | null; error?: string }>;
}> {
  if (!isSupabaseConfigured()) {
    return { configured: false, authOk: false, tables: [] };
  }

  const authRes = await fetch(`${config.supabaseUrl}/auth/v1/health`, {
    headers: { apikey: config.supabaseServiceKey },
  });
  const authOk = authRes.ok;

  const tables = await Promise.all(
    TABLE_NAMES.map(async (table) => {
      const { error, status } = await supabaseFetch(table, 'select=*&limit=1');
      const rows = await countTable(table);
      return {
        table,
        ok: !error && status === 200,
        rows,
        error: error ?? undefined,
      };
    }),
  );

  return { configured: true, authOk, tables };
}

export async function listTableRows(table: SupabaseTable, limit = 50) {
  return supabaseFetch<unknown[]>(table, `select=*&limit=${limit}`);
}

export async function getMatrixSnapshot() {
  const health = await checkSupabaseHealth();
  const data: Record<string, unknown> = {};

  if (health.configured) {
    for (const table of TABLE_NAMES) {
      const { data: rows } = await supabaseFetch<unknown[]>(table, 'select=*&limit=20');
      data[table] = rows ?? [];
    }
  }

  return { health, data };
}

export async function supabaseInsert<T = unknown>(
  table: SupabaseTable,
  row: Record<string, unknown>,
  prefer = 'return=representation',
): Promise<{ data: T | null; error: string | null; status: number }> {
  const res = await fetch(restUrl(table), {
    method: 'POST',
    headers: restHeaders({
      'Content-Type': 'application/json',
      Prefer: prefer,
    }),
    body: JSON.stringify(row),
  });
  const body = await parseJson(res);
  if (!res.ok) {
    const msg =
      typeof body === 'object' && body && 'message' in body
        ? String((body as { message: string }).message)
        : `HTTP ${res.status}`;
    return { data: null, error: msg, status: res.status };
  }
  const data = Array.isArray(body) ? (body[0] as T) : (body as T);
  return { data, error: null, status: res.status };
}

export async function supabasePatch(
  table: SupabaseTable,
  filter: string,
  patch: Record<string, unknown>,
): Promise<{ error: string | null; status: number }> {
  const res = await fetch(restUrl(table, filter), {
    method: 'PATCH',
    headers: restHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    }),
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const body = await parseJson(res);
    const msg =
      typeof body === 'object' && body && 'message' in body
        ? String((body as { message: string }).message)
        : `HTTP ${res.status}`;
    return { error: msg, status: res.status };
  }
  return { error: null, status: res.status };
}

export interface SupabaseAuthUser {
  id: string;
  email: string;
}

export async function verifySupabaseToken(token: string): Promise<SupabaseAuthUser | null> {
  if (!isSupabaseConfigured() || !token) return null;

  const res = await fetch(`${config.supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: config.supabaseServiceKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return null;
  const body = (await res.json()) as { id?: string; email?: string };
  if (!body.id || !body.email) return null;
  return { id: body.id, email: body.email };
}

export async function supabaseAuthSignUp(
  email: string,
  password: string,
  name?: string,
): Promise<{ accessToken: string | null; userId: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { accessToken: null, userId: null, error: 'Supabase não configurado' };
  }

  const existing = await findAuthUserByEmail(email);
  if (existing) {
    return { accessToken: null, userId: null, error: 'Este e-mail já está cadastrado' };
  }

  // Admin API: cria usuário já confirmado — não dispara e-mail (evita 429 rate limit)
  const res = await fetch(`${config.supabaseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      apikey: config.supabaseServiceKey,
      Authorization: `Bearer ${config.supabaseServiceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: name ? { name } : {},
    }),
  });

  const body = (await res.json()) as {
    id?: string;
    msg?: string;
    message?: string;
    error_description?: string;
  };

  if (!res.ok) {
    const msg = body.msg ?? body.message ?? body.error_description ?? `HTTP ${res.status}`;
    if (res.status === 422 || msg.toLowerCase().includes('already')) {
      return { accessToken: null, userId: null, error: 'Este e-mail já está cadastrado' };
    }
    return { accessToken: null, userId: null, error: msg };
  }

  const userId = body.id ?? null;
  if (!userId) {
    return { accessToken: null, userId: null, error: 'Falha ao criar usuário' };
  }

  return supabaseAuthSignIn(email, password);
}

export async function supabaseAuthSignIn(
  email: string,
  password: string,
): Promise<{ accessToken: string | null; userId: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { accessToken: null, userId: null, error: 'Supabase não configurado' };
  }

  const res = await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: config.supabaseServiceKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const body = (await res.json()) as {
    access_token?: string;
    user?: { id?: string };
    error_description?: string;
    msg?: string;
  };

  if (!res.ok) {
    return {
      accessToken: null,
      userId: null,
      error: body.error_description ?? body.msg ?? 'E-mail ou senha incorretos',
    };
  }

  return {
    accessToken: body.access_token ?? null,
    userId: body.user?.id ?? null,
    error: null,
  };
}

export async function findAuthUserByEmail(email: string): Promise<SupabaseAuthUser | null> {
  if (!isSupabaseConfigured()) return null;

  const trimmed = email.trim();
  const normalized = trimmed.toLowerCase();

  // GoTrue admin API usa `filter`, não `email` — sem isso retorna a 1ª página e gera falso positivo
  const res = await fetch(
    `${config.supabaseUrl}/auth/v1/admin/users?filter=${encodeURIComponent(trimmed)}&per_page=50`,
    {
      headers: {
        apikey: config.supabaseServiceKey,
        Authorization: `Bearer ${config.supabaseServiceKey}`,
      },
    },
  );

  if (!res.ok) return null;
  const body = (await res.json()) as { users?: Array<{ id: string; email: string }> };
  const user = body.users?.find((u) => u.email?.toLowerCase() === normalized);
  return user ? { id: user.id, email: user.email } : null;
}
