'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/hooks/useAuth';
import { getHomePathForUser } from '@/lib/navigation/home-path';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError(null);
    const { error: err, user: loggedIn } = await signIn(data.email, data.password);
    if (err) {
      setError(err);
      setSubmitting(false);
      return;
    }
    router.push(searchParams.get('redirect') ?? getHomePathForUser(loggedIn));
  };

  return (
    <Card className="top-shine animate-fade-in border-neon/20 bg-surface/90 p-5 backdrop-blur-sm sm:bg-surface sm:p-7 lg:p-8">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
          Bem-vindo de volta
        </h1>
        <p className="mt-1 text-xs text-zinc-500 sm:mt-2 sm:text-sm">
          Entre para ver seus replays e ranking.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:gap-4">
        <Input
          label="E-mail"
          type="email"
          placeholder="voce@email.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400 sm:text-sm">
            {error}
          </p>
        )}

        <Button type="submit" loading={submitting} className="mt-0.5 w-full sm:mt-1">
          Entrar
          <ArrowRight className="h-4 w-4" />
        </Button>

        <button
          type="button"
          className="text-xs text-zinc-500 transition-colors hover:text-neon"
        >
          Esqueci minha senha
        </button>
      </form>

      <p className="mt-4 border-t border-zinc-800/80 pt-4 text-center text-xs text-zinc-500 sm:mt-6 sm:pt-6 sm:text-sm">
        Não tem conta?{' '}
        <Link href="/signup" className="font-semibold text-neon transition-opacity hover:opacity-80">
          Criar conta grátis
        </Link>
      </p>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
