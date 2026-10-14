import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { BeltThemeProvider } from '@/components/providers/BeltThemeProvider';
import { MswProvider } from '@/components/providers/MswProvider';
import { AuthProvider } from '@/lib/hooks/useAuth';
import { ToastProvider } from '@/components/ui/Toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'BJJ Replay — Seus replays de luta, automáticos',
  description:
    'Replays de Jiu-Jitsu capturados pela boxe com IA. Biblioteca pessoal, histórico de lutas e streaming via CDN para atletas e academias.',
  icons: {
    icon: [
      { url: '/favicon.ico?v=7', sizes: 'any' },
      { url: '/favicon-32.png?v=7', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/logo-icon-180.png?v=7', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico?v=7'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} font-sans bg-background text-zinc-100 antialiased`}>
        <MswProvider>
          <AuthProvider>
            <BeltThemeProvider>
              <ToastProvider>{children}</ToastProvider>
            </BeltThemeProvider>
          </AuthProvider>
        </MswProvider>
      </body>
    </html>
  );
}
