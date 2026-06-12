'use client';

import { useEffect, useState } from 'react';

/** Faixa vermelha no topo — progresso do scroll da landing. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      setProgress(max > 0 ? Math.min(100, (scrollTop / max) * 100) : 0);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-1 bg-black/70 shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]"
    >
      <div
        className="relative h-full bg-bjj-red shadow-[0_0_14px_rgba(220,38,38,0.95),0_2px_8px_rgba(220,38,38,0.5)] transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      >
        <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-red-300 shadow-[0_0_8px_rgba(252,165,165,0.9)]" />
      </div>
    </div>
  );
}
