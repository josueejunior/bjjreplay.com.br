'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isProfessorUser } from '@/lib/navigation/home-path';
import { useAuth } from '@/lib/hooks/useAuth';

/** Envia professor para o painel da academia (rotas de atleta). */
export function useRedirectProfessor(): boolean {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && isProfessorUser(user)) {
      router.replace('/professor');
    }
  }, [loading, user, router]);

  return !loading && isProfessorUser(user);
}
