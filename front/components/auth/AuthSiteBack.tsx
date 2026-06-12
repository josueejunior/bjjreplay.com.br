import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function AuthSiteBack() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-surface/70 px-3.5 py-2 text-sm font-medium text-zinc-400 backdrop-blur-sm transition-all duration-200 hover:border-neon/35 hover:bg-surface hover:text-neon"
    >
      <ArrowLeft className="h-4 w-4 shrink-0" />
      Voltar ao site
    </Link>
  );
}
