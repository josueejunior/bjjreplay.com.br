'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

const links = [
  { href: '#features', label: 'Funcionalidades' },
  { href: '#how-it-works', label: 'Como funciona' },
  { href: '#testimonials', label: 'Depoimentos' },
  { href: '#pricing', label: 'Planos' },
  { href: '#faq', label: 'FAQ' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 z-40 w-full transition-all duration-500',
        scrolled
          ? 'border-b border-red-950/40 bg-background/90 backdrop-blur-xl'
          : 'border-b border-transparent bg-background/20 backdrop-blur-sm'
      )}
    >
      {scrolled && (
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />
      )}

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:h-20 sm:gap-3 sm:px-6">
        <Link href="/" className="group min-w-0 shrink">
          <Logo
            size="nav"
            priority
            variant="elevated"
            className="h-11 w-auto sm:h-[4.25rem]"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-zinc-300 transition-all duration-300 hover:bg-red-600/10 hover:text-red-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <Link href="/login" className="hidden sm:block">
            <Button variant="outline" size="sm" className="px-4">
              Fazer login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="px-3 shadow-none sm:px-4">
              <span className="sm:hidden">Cadastrar</span>
              <span className="hidden sm:inline">Inscreva-se gratuitamente</span>
            </Button>
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-b border-red-950/40 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-red-600/10 hover:text-red-200"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="mt-2"
              >
                <Button size="md" className="w-full">
                  Inscreva-se gratuitamente
                </Button>
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-red-600/10 hover:text-red-200 sm:hidden"
              >
                Entrar
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
