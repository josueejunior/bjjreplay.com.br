'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ImageCurationCard } from '@/components/admin/ImageCurationCard';
import { useToast } from '@/components/ui/Toast';
import { useApi } from '@/lib/hooks/useApi';
import { useAuth } from '@/lib/hooks/useAuth';
import { categorizeImage, getAdminImages } from '@/lib/api/endpoints';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const isAdmin = Boolean(user?.isAdmin);
  const { data: images, loading, error } = useApi(getAdminImages, [isAdmin], isAdmin && !authLoading);
  const [categorizedIds, setCategorizedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!authLoading && user && !user.isAdmin) {
      router.replace('/dashboard');
    }
  }, [authLoading, user, router]);

  const progress = useMemo(() => {
    if (!images) return { done: 0, total: 0, pct: 0 };
    const preCategorized = images.filter((img) => img.category !== null).map((img) => img.id);
    const done = new Set([...preCategorized, ...Array.from(categorizedIds)]).size;
    return { done, total: images.length, pct: images.length ? (done / images.length) * 100 : 0 };
  }, [images, categorizedIds]);

  const handleCategorize = async (imageId: string, category: string) => {
    try {
      const response = await categorizeImage(imageId, category);
      setCategorizedIds((prev) => new Set(prev).add(imageId));
      toast(response.message);
    } catch {
      toast('Erro ao categorizar imagem', 'error');
      throw new Error('categorize failed');
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-neon" />
      </div>
    );
  }

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-7"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neon/20 bg-neon/10 shadow-glow">
              <ShieldCheck className="h-6 w-6 text-neon" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Curadoria de conteúdo
              </h1>
              <p className="text-sm text-zinc-500">
                Classifique as imagens enviadas pela comunidade.
              </p>
            </div>
          </div>

          {/* Progresso da curadoria */}
          {images && (
            <div className="card-premium w-full rounded-2xl border border-zinc-800 p-4 sm:w-64">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-zinc-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-neon" />
                  Categorizadas
                </span>
                <span className="font-bold text-white">
                  {progress.done}
                  <span className="font-normal text-zinc-500">/{progress.total}</span>
                </span>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                  animate={{ width: `${progress.pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full bg-neon-gradient shadow-glow"
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-72" />
          ))}
        </div>
      )}

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          Erro ao carregar imagens: {error}
        </p>
      )}

      {images && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image, i) => (
            <ImageCurationCard
              key={image.id}
              image={image}
              index={i}
              onCategorize={handleCategorize}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
