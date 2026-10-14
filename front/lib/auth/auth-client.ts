import { isAxiosError } from 'axios';
import { api, USE_MOCKS } from '@/lib/api/client';
import { getAuthMe } from '@/lib/api/endpoints';
import { getSupabase, hasSupabaseCredentials } from '@/lib/supabase/client';
import type { SportLevel, UserProfile } from '@/types';

const MOCK_USER_KEY = 'volt_mock_user';
const TOKEN_KEY = 'access_token';
const SESSION_COOKIE = 'volt_session';
const ADMIN_COOKIE = 'volt_is_admin';

export interface AuthResult {
  user: UserProfile | null;
  error: string | null;
}

function setSessionCookie(active: boolean, isAdmin = false) {
  if (typeof document === 'undefined') return;
  if (active) {
    document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}`;
    if (isAdmin) {
      document.cookie = `${ADMIN_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}`;
    } else {
      document.cookie = `${ADMIN_COOKIE}=; path=/; max-age=0`;
    }
  } else {
    document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
    document.cookie = `${ADMIN_COOKIE}=; path=/; max-age=0`;
  }
}

function buildMockUser(email: string): UserProfile {
  return {
    id: `mock-${Date.now()}`,
    email,
    name: email.split('@')[0],
    avatarUrl: null,
    sportLevel: 'iniciante',
    plan: 'free',
    isAdmin: false,
    belt: 'branca',
    degree: 0,
    weightKg: null,
    academyName: null,
    role: 'atleta',
    athleteCategory: 'adulto',
    guardianCpf: null,
    guardianName: null,
    birthDate: null,
  };
}

export function getStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(MOCK_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function storeUser(user: UserProfile) {
  window.localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
  setSessionCookie(true, user.isAdmin);
}

function storeToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

function extractApiError(err: unknown): string {
  if (isAxiosError(err)) {
    return err.response?.data?.detail ?? 'Erro de conexão com o servidor';
  }
  return 'Erro inesperado';
}

async function syncProfileFromApi(): Promise<UserProfile> {
  const user = await getAuthMe();
  storeUser(user);
  return user;
}

/** Auth contra o back-end Node (SQLite local ou Supabase via API) */
async function backendAuth(path: 'signup' | 'login', email: string, password: string): Promise<AuthResult> {
  try {
    const { data } = await api.post<{ user: UserProfile; accessToken: string }>(
      `/api/auth/${path}`,
      { email, password },
    );
    storeToken(data.accessToken);
    storeUser(data.user);
    return { user: data.user, error: null };
  } catch (err) {
    return { user: null, error: extractApiError(err) };
  }
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  // Produção: cadastro via API (Admin Supabase — sem e-mail de confirmação, evita 429)
  if (!USE_MOCKS) {
    return backendAuth('signup', email, password);
  }

  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { user: null, error: error.message };
    const user = buildMockUser(email);
    user.id = data.user?.id ?? user.id;
    storeUser(user);
    return { user, error: null };
  }

  const user = buildMockUser(email);
  storeUser(user);
  return { user, error: null };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (!USE_MOCKS) {
    return backendAuth('login', email, password);
  }

  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error: error.message };
    const stored = getStoredUser();
    const user = stored?.email === email ? stored : buildMockUser(email);
    user.id = data.user?.id ?? user.id;
    storeUser(user);
    return { user, error: null };
  }

  const stored = getStoredUser();
  const user = stored?.email === email ? stored : buildMockUser(email);
  storeUser(user);
  return { user, error: null };
}

export async function signOut(): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.auth.signOut();
  }
  window.localStorage.removeItem(MOCK_USER_KEY);
  window.localStorage.removeItem(TOKEN_KEY);
  setSessionCookie(false);
}

export function updateStoredProfile(patch: Partial<Pick<UserProfile, 'sportLevel' | 'avatarUrl' | 'name' | 'plan' | 'belt' | 'degree' | 'weightKg' | 'academyName'>>): UserProfile | null {
  const user = getStoredUser();
  if (!user) return null;
  const updated = { ...user, ...patch };
  storeUser(updated);
  return updated;
}

/**
 * Restaura sessão: Supabase token → API /auth/me → perfil alunos (Matrix).
 */
export async function hydrateSession(): Promise<UserProfile | null> {
  if (typeof window === 'undefined') return null;

  if (USE_MOCKS) {
    return getStoredUser();
  }

  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token ?? window.localStorage.getItem(TOKEN_KEY);
    if (!token) {
      window.localStorage.removeItem(MOCK_USER_KEY);
      setSessionCookie(false);
      return null;
    }
    storeToken(token);
    try {
      return await syncProfileFromApi();
    } catch {
      window.localStorage.removeItem(MOCK_USER_KEY);
      window.localStorage.removeItem(TOKEN_KEY);
      setSessionCookie(false);
      return null;
    }
  }

  const token = window.localStorage.getItem(TOKEN_KEY);
  if (!token) {
    window.localStorage.removeItem(MOCK_USER_KEY);
    setSessionCookie(false);
    return null;
  }

  try {
    return await syncProfileFromApi();
  } catch {
    window.localStorage.removeItem(MOCK_USER_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
    setSessionCookie(false);
    return null;
  }
}

export { hasSupabaseCredentials };
export type { SportLevel };
