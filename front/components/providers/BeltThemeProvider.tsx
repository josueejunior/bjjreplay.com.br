'use client';

import { useEffect } from 'react';
import { applyBeltTheme, resetBeltTheme } from '@/lib/bjj/belt-theme';
import { useAuth } from '@/lib/hooks/useAuth';

/** Aplica cor neon personalizada conforme a faixa do atleta logado */
export function BeltThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.belt) {
      applyBeltTheme(user.belt);
    } else {
      resetBeltTheme();
    }
  }, [user?.belt]);

  return children;
}
