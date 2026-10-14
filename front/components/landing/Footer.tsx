'use client';

import { useState, type FormEvent, type ElementType } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Cloud,
  Cookie,
  CreditCard,
  Crown,
  FileText,
  HelpCircle,
  Instagram,
  Layers,
  Linkedin,
  LogIn,
  Mail,
  MapPin,
  MessageCircle,
  PlayCircle,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Trophy,
  UserPlus,
  Video,
  Youtube,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

/** Dados de contato oficiais — fonte única para rodapé e links de suporte. */
const CONTATO = {
  telefone: '(86) 98112-9272',
  whatsapp: 'https://wa.me/5586981129272',
  email: 'contato@bjjreplay.com.br',
  cidade: 'Parnaíba — PI, Brasil',
  cnpj: '60.823.969/0001-94',
};

type FooterLink = { label: string; href: string; icon: ElementType };

const columns: { title: string; icon: ElementType; links: FooterLink[] }[] = [
  {
    title: 'Recursos',
    icon: Layers,
    links: [
      { label: 'Funcionalidades', href: '#features', icon: Sparkles },
      { label: 'Como funciona', href: '#how-it-works', icon: PlayCircle },
      { label: 'Depoimentos', href: '#testimonials', icon: Star },
      { label: 'FAQ', href: '#faq', icon: HelpCircle },
    ],
  },
  {
    title: 'Assinatura',
    icon: CreditCard,
    links: [
      { label: 'Planos e preços', href: '#pricing', icon: Layers },
      { label: 'Plano Premium', href: '/signup?plan=premium', icon: Trophy },
      { label: 'Plano Black', href: '/signup?plan=black', icon: Crown },
      { label: 'Começar grátis', href: '/signup', icon: UserPlus },
    ],
  },
  {
    title: 'Conta',
    icon: UserPlus,
    links: [
      { label: 'Fazer login', href: '/login', icon: LogIn },
      { label: 'Inscreva-se gratuitamente', href: '/signup', icon: UserPlus },
      { label: 'Suporte no WhatsApp', href: CONTATO.whatsapp, icon: MessageCircle },
    ],
  },
  {
    title: 'Privacidade',
    icon: ShieldCheck,
    links: [
      { label: 'Termos de uso', href: '#', icon: FileText },
      { label: 'Política de privacidade', href: '#', icon: ShieldCheck },
      { label: 'Política de cookies', href: '#', icon: Cookie },
      { label: 'Contato', href: `mailto:${CONTATO.email}`, icon: Mail },
    ],
  },
];

const highlights = [
  { icon: Video, label: 'Replay automático' },
  { icon: Cloud, label: 'Biblioteca na nuvem' },
  { icon: Trophy, label: 'Ranking ao vivo' },
  { icon: Smartphone, label: 'App mobile' },
];

const socials = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com' },
  { icon: MessageCircle, label: 'WhatsApp', href: CONTATO.whatsapp },
  {
    icon: ({ className }: { className?: string }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    label: 'X / Twitter',
    href: 'https://x.com',
  },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
  {
    icon: ({ className }: { className?: string }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
      </svg>
    ),
    label: 'TikTok',
    href: 'https://tiktok.com',
  },
];

const contacts = [
  { icon: MessageCircle, label: CONTATO.telefone, href: CONTATO.whatsapp },
  { icon: Mail, label: CONTATO.email, href: `mailto:${CONTATO.email}` },
  { icon: MapPin, label: CONTATO.cidade, href: '#' },
];

function FooterLinkItem({ link }: { link: FooterLink }) {
  const Icon = link.icon;
  const className =
    'group/link flex items-center gap-2 text-sm text-zinc-500 transition-colors duration-200 hover:text-neon';

  const content = (
    <>
      <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-600 transition-colors group-hover/link:text-neon/70" />
      <span>{link.label}</span>
    </>
  );

  if (link.href.startsWith('/')) {
    return (
      <Link href={link.href} className={className}>
        {content}
      </Link>
    );
  }

  const externo = link.href.startsWith('http');

  return (
    <a
      href={link.href}
      className={className}
      {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </a>
  );
}

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <footer className="relative border-t border-bjj-blue/30 bg-bjj-blue-dark">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8 sm:pb-12 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:gap-16">
          {/* Marca + newsletter */}
          <div>
            <Link href="/" className="inline-flex transition-opacity hover:opacity-90">
              <Logo size="lg" variant="elevated" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
              Replay automático de luta com IA. Do tatame direto para a sua biblioteca.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:max-w-sm">
              {highlights.map((item) => (
                <span
                  key={item.label}
                  className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-[11px] text-zinc-400"
                >
                  <item.icon className="h-3.5 w-3.5 shrink-0 text-neon/80" />
                  {item.label}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <p className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
                <BookOpen className="h-4 w-4 text-neon/70" />
                Dicas de treino toda semana
              </p>
              {subscribed ? (
                <p className="mt-3 flex items-center gap-2 text-sm text-neon">
                  <CheckCircle2 className="h-4 w-4" />
                  Inscrição confirmada. Bons treinos!
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-3 flex max-w-sm gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="h-10 flex-1 rounded-lg border border-zinc-800 bg-surface-raised px-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition-all duration-200 focus:border-neon/50 focus:outline-none focus:ring-1 focus:ring-neon/30"
                  />
                  <Button type="submit" size="md" className="h-10 shrink-0 px-4">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Colunas de links */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {columns.map((column) => {
              const ColumnIcon = column.icon;
              return (
                <nav key={column.title} aria-label={column.title}>
                  <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-200">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-neon/20 bg-neon/5">
                      <ColumnIcon className="h-3.5 w-3.5 text-neon" />
                    </span>
                    {column.title}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <FooterLinkItem link={link} />
                      </li>
                    ))}
                  </ul>
                </nav>
              );
            })}
          </div>
        </div>

        {/* Contato rápido */}
        <div className="mt-12 flex flex-wrap gap-3 border-t border-zinc-800/60 pt-8">
          {contacts.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              className="flex items-center gap-2 rounded-full border border-zinc-800 bg-surface/40 px-3.5 py-2 text-xs text-zinc-500 transition-all duration-200 hover:border-neon/30 hover:text-zinc-300"
            >
              <contact.icon className="h-3.5 w-3.5 text-neon/70" />
              {contact.label}
            </a>
          ))}
        </div>

        {/* Rodapé final */}
        <div className="mt-8 flex flex-col gap-6 border-t border-zinc-800/60 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-surface/50',
                  'text-zinc-500 transition-all duration-200',
                  'hover:border-neon/40 hover:bg-neon/10 hover:text-neon hover:shadow-glow'
                )}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-neon/50" />
              Dados protegidos
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-neon/50" />
              Pagamento seguro
            </span>
            <span className="flex items-center gap-1.5">
              <ArrowUpRight className="h-3.5 w-3.5 text-neon/50" />
              Cancele em 2 cliques
            </span>
          </div>

          <p className="text-xs text-zinc-600 lg:text-right">
            CNPJ {CONTATO.cnpj}
            <br className="hidden lg:block" />{' '}
            © {new Date().getFullYear()} BJJ Replay. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
