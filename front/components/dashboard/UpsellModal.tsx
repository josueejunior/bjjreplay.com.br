'use client';

import Link from 'next/link';
import { Check, Crown, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { Video } from '@/types';

interface UpsellModalProps {
  video: Video | null;
  onClose: () => void;
}

const premiumPerks = ['Vídeos ilimitados', 'Downloads em HD', 'Estatísticas avançadas'];
const blackPerks = ['Tudo do Premium', 'Vídeos em 4K', 'Análise com IA'];

export function UpsellModal({ video, onClose }: UpsellModalProps) {
  const isBlack = video?.requiredPlan === 'black';
  const perks = isBlack ? blackPerks : premiumPerks;

  return (
    <Modal open={Boolean(video)} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <span
          className={
            isBlack
              ? 'mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/40 bg-gradient-to-b from-violet-500/20 to-transparent shadow-[0_0_28px_rgba(167,139,250,0.25)]'
              : 'mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/40 bg-gradient-to-b from-amber-400/20 to-transparent shadow-[0_0_28px_rgba(251,191,36,0.25)]'
          }
        >
          {isBlack ? (
            <Crown className="h-7 w-7 text-violet-300" />
          ) : (
            <Lock className="h-7 w-7 text-amber-300" />
          )}
        </span>

        <h3 className="text-lg font-bold text-white">
          {isBlack ? 'Conteúdo exclusivo Black' : 'Conteúdo Premium'}
        </h3>
        <p className="mt-2 text-sm text-zinc-400">
          <span className="font-medium text-zinc-200">&ldquo;{video?.title}&rdquo;</span> está
          disponível apenas para assinantes {isBlack ? 'Black' : 'Premium'}.
        </p>

        <ul className="mt-5 flex w-full flex-col gap-2 rounded-lg border border-zinc-800 bg-surface-raised p-4 text-left">
          {perks.map((perk) => (
            <li key={perk} className="flex items-center gap-2 text-sm text-zinc-300">
              <Check className="h-4 w-4 text-neon" />
              {perk}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex w-full flex-col gap-2">
          <Link href={`/#pricing`} className="w-full">
            <Button variant={isBlack ? 'metallic' : 'primary'} className="w-full">
              {isBlack ? 'Conhecer o Black' : 'Fazer upgrade agora'}
            </Button>
          </Link>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Agora não
          </Button>
        </div>
      </div>
    </Modal>
  );
}
