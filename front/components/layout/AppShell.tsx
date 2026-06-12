'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Clapperboard, GraduationCap, LayoutDashboard, LogOut, Menu, ShieldCheck, X } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { BeltAvatar } from '@/components/ui/BeltAvatar';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';
import { getHomePathForUser, isAthleteUser } from '@/lib/navigation/home-path';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false, professorOnly: false, athleteOnly: true },
  { href: '/biblioteca', label: 'Biblioteca', icon: Clapperboard, adminOnly: false, professorOnly: false, athleteOnly: true },
  { href: '/professor', label: 'Professor', icon: GraduationCap, adminOnly: false, professorOnly: true, athleteOnly: false },
  { href: '/admin', label: 'Admin', icon: ShieldCheck, adminOnly: true, professorOnly: false, athleteOnly: false },
];

export function AppShell({ children, sidebar }: { children: ReactNode; sidebar?: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleNavItems = navItems.filter((item) => {
    if (item.adminOnly && !user?.isAdmin) return false;
    if (item.professorOnly && user?.role !== 'professor' && !user?.isAdmin) return false;
    if (item.athleteOnly && user && !isAthleteUser(user)) return false;
    return true;
  });

  const homeHref = getHomePathForUser(user);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Glows ambiente */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/4 h-96 w-[700px] -translate-x-1/2 rounded-full bg-neon/[0.04] blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-sky-500/[0.03] blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-zinc-800/60 bg-background/75 backdrop-blur-xl">
        {/* Linha de brilho no rodapé do header */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neon/25 to-transparent" />

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
          <div className="flex items-center gap-3">
            {sidebar && (
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menu"
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <Link href={homeHref} className="group shrink-0">
              <Logo
                size="nav"
                variant="elevated"
                className="h-11 w-auto max-w-[88px] sm:h-14 sm:max-w-[120px]"
              />
            </Link>

            {/* Nav com indicador animado */}
            <nav className="ml-2 flex items-center gap-1 rounded-full border border-zinc-800/80 bg-surface/60 p-1">
              {visibleNavItems.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300',
                      active ? 'text-neon' : 'text-zinc-400 hover:text-zinc-100'
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                        className="absolute inset-0 rounded-full bg-neon/10 ring-1 ring-inset ring-neon/30"
                      />
                    )}
                    <item.icon className="relative h-4 w-4" />
                    <span className="relative hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Chip do usuário → perfil */}
            <Link
              href="/perfil"
              title="Meu perfil"
              className={cn(
                'hidden items-center gap-2.5 rounded-full border py-1 pl-1 pr-3 transition-all duration-300 md:flex',
                pathname.startsWith('/perfil')
                  ? 'border-neon/30 bg-neon/10 shadow-glow'
                  : 'border-zinc-800/80 bg-surface/60 hover:border-neon/25 hover:bg-surface'
              )}
            >
              <BeltAvatar
                name={user?.name ?? 'Atleta'}
                avatarUrl={user?.avatarUrl}
                belt={user?.belt ?? 'branca'}
                size="sm"
              />
              <span className="max-w-[120px] truncate text-sm text-zinc-300">
                {user?.name ?? 'Atleta'}
              </span>
              <Badge
                variant={user?.plan === 'free' ? 'zinc' : user?.plan === 'black' ? 'black' : 'premium'}
                className="px-2 py-0 text-[10px]"
              >
                {user?.plan === 'free' ? 'Free' : user?.plan === 'black' ? 'Black' : 'Premium'}
              </Badge>
            </Link>

            <Link
              href="/perfil"
              title="Meu perfil"
              className={cn(
                'rounded-full p-0.5 transition-all md:hidden',
                pathname.startsWith('/perfil') && 'ring-2 ring-neon/40'
              )}
            >
              <BeltAvatar
                name={user?.name ?? 'Atleta'}
                avatarUrl={user?.avatarUrl}
                belt={user?.belt ?? 'branca'}
                size="sm"
              />
            </Link>

            <button
              onClick={handleSignOut}
              title="Sair"
              className="flex items-center gap-2 rounded-full border border-transparent p-2 text-sm text-zinc-500 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 sm:px-3"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6">
        {sidebar && (
          <aside className="sticky top-[96px] hidden h-fit w-[290px] shrink-0 lg:block">
            {sidebar}
          </aside>
        )}
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Drawer mobile */}
      <AnimatePresence>
        {sidebar && mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute left-0 top-0 h-full w-[310px] overflow-y-auto border-r border-zinc-800 bg-surface p-4"
            >
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
                className="mb-4 rounded-lg p-2 text-zinc-400 hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
              {sidebar}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
