import type { UserProfile } from '@/types';

/** Rota inicial após login conforme o papel do usuário. */
export function getHomePathForUser(user: UserProfile | null | undefined): string {
  if (!user) return '/login';
  if (user.isAdmin) return '/admin';
  if (user.role === 'professor') return '/professor';
  return '/dashboard';
}

export function isProfessorUser(user: UserProfile | null | undefined): boolean {
  return user?.role === 'professor' && !user.isAdmin;
}

export function isAthleteUser(user: UserProfile | null | undefined): boolean {
  if (!user) return false;
  if (user.isAdmin) return true;
  return user.role === 'atleta';
}
