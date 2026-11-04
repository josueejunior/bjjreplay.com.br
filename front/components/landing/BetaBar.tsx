import { BETA_GRATUITO } from '@/lib/config/beta';

export function BetaBar() {
  if (!BETA_GRATUITO) return null;
  return (
    <div className="relative z-50 bg-bjj-red text-white">
      <p className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-base font-semibold leading-snug">
        <span className="rounded-sm bg-white px-2 py-0.5 text-sm font-extrabold uppercase tracking-wider text-bjj-red">
          Beta gratuito
        </span>
        <span>Estamos testando na academia. Sua ajuda melhora o sistema.</span>
      </p>
    </div>
  );
}
