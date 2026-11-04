'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ACADEMIAS } from '@/lib/config/academias';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  /** Valor antigo (texto livre) de quem já tinha cadastro: continua escolhível até a pessoa trocar. */
  valorAtual?: string | null;
}

export const AcademiaSelect = forwardRef<HTMLSelectElement, Props>(({ error, valorAtual, ...props }, ref) => {
  const opcoes = valorAtual && !ACADEMIAS.includes(valorAtual) ? [valorAtual, ...ACADEMIAS] : ACADEMIAS;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="academyName" className="text-sm font-medium text-zinc-300">Academia vinculada</label>
      <select
        id="academyName"
        ref={ref}
        className="h-11 rounded-lg border border-zinc-800 bg-surface-raised px-4 text-sm text-zinc-100 focus:border-red-500 focus:outline-none"
        {...props}
      >
        <option value="">Escolha sua academia</option>
        {opcoes.map((a) => <option key={a} value={a}>{a}</option>)}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
});
AcademiaSelect.displayName = 'AcademiaSelect';
