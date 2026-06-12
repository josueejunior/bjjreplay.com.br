'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  hydrateSession,
  signIn as authSignIn,
  signOut as authSignOut,
  signUp as authSignUp,
  updateStoredProfile,
} from '@/lib/auth/auth-client';
import type { UserProfile } from '@/types';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null; user: UserProfile | null }>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<UserProfile, 'sportLevel' | 'avatarUrl' | 'name' | 'plan' | 'belt' | 'degree' | 'weightKg' | 'academyName' | 'athleteCategory' | 'guardianCpf' | 'guardianName' | 'birthDate'>>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hydrateSession()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { user: u, error } = await authSignIn(email, password);
    if (u) setUser(u);
    return { error, user: u };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { user: u, error } = await authSignUp(email, password);
    if (u) setUser(u);
    return error;
  }, []);

  const signOut = useCallback(async () => {
    await authSignOut();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<Pick<UserProfile, 'sportLevel' | 'avatarUrl' | 'name' | 'plan' | 'belt' | 'degree' | 'weightKg' | 'academyName' | 'athleteCategory' | 'guardianCpf' | 'guardianName' | 'birthDate'>>) => {
      const updated = updateStoredProfile(patch);
      if (updated) setUser(updated);
    },
    []
  );

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
