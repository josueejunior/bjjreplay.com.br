'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Save, UserCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppShell } from '@/components/layout/AppShell';
import { AvatarUpload } from '@/components/auth/AvatarUpload';
import { AthleteCategoryPicker } from '@/components/auth/AthleteCategoryPicker';
import { BeltPicker } from '@/components/auth/BeltPicker';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { BELT_THEMES, isBeltValidForCategory } from '@/lib/bjj/belt-theme';
import { useAuth } from '@/lib/hooks/useAuth';
import { updateProfile as updateProfileApi } from '@/lib/api/endpoints';
import { cpfDigits, formatCpf, isValidCpf } from '@/lib/utils/cpf';
import type { AthleteCategory, FaixaBelt } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Nome completo obrigatório'),
  degree: z.coerce.number().min(0).max(4),
  weightKg: z.coerce.number().min(30, 'Peso mínimo 30 kg').max(200, 'Peso máximo 200 kg'),
  academyName: z.string().min(2, 'Informe sua academia'),
});

type ProfileForm = z.infer<typeof schema>;

const roleLabels = {
  atleta: 'Atleta',
  professor: 'Professor',
  admin: 'Administrador',
} as const;

export default function PerfilPage() {
  const { user, updateProfile: updateLocalProfile } = useAuth();
  const [belt, setBelt] = useState<FaixaBelt>(user?.belt ?? 'branca');
  const [athleteCategory, setAthleteCategory] = useState<AthleteCategory>(
    user?.athleteCategory ?? 'adulto'
  );
  const [guardianCpf, setGuardianCpf] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [avatar, setAvatar] = useState<string | null>(user?.avatarUrl ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? '',
      degree: user?.degree ?? 0,
      weightKg: user?.weightKg ?? 70,
      academyName: user?.academyName ?? '',
    },
  });

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name,
      degree: user.degree,
      weightKg: user.weightKg ?? 70,
      academyName: user.academyName ?? '',
    });
    setBelt(user.belt);
    setAthleteCategory(user.athleteCategory ?? 'adulto');
    setGuardianCpf(user.guardianCpf ? formatCpf(user.guardianCpf) : '');
    setGuardianName(user.guardianName ?? '');
    setAvatar(user.avatarUrl);
  }, [user, reset]);

  const handleCategoryChange = (category: AthleteCategory) => {
    setAthleteCategory(category);
    if (!isBeltValidForCategory(belt, category)) {
      setBelt('branca');
    }
    if (category === 'adulto') {
      setGuardianCpf('');
      setGuardianName('');
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    setSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      if (athleteCategory === 'kids') {
        const normalizedName = guardianName.trim().replace(/\s+/g, ' ');
        if (!normalizedName || normalizedName.length < 2) {
          setError('Informe o nome completo do pai ou responsável');
          setSubmitting(false);
          return;
        }
        if (!isValidCpf(guardianCpf)) {
          setError('CPF do responsável inválido');
          setSubmitting(false);
          return;
        }
      }
      const payload = {
        name: data.name.trim(),
        belt,
        degree: data.degree,
        weightKg: data.weightKg,
        academyName: data.academyName.trim().replace(/\s+/g, ' '),
        avatarUrl: avatar,
        athleteCategory,
        guardianCpf: athleteCategory === 'kids' ? cpfDigits(guardianCpf) : null,
        guardianName: athleteCategory === 'kids' ? guardianName.trim().replace(/\s+/g, ' ') : null,
      };
      await updateProfileApi(payload);
      updateLocalProfile(payload);
      setSaved(true);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string }; status?: number } }).response?.data
              ?.detail ??
            ((err as { response?: { status?: number } }).response?.status === 413
              ? 'Foto muito grande. Escolha uma imagem menor.'
              : null)
          : null;
      setError(message ?? 'Não foi possível salvar o perfil.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <AppShell>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando perfil…
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-xl"
      >
        <div className="mb-7">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">Conta</p>
          <h1 className="mt-1.5 flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white">
            <UserCircle className="h-7 w-7 text-neon" />
            Meu <span className="text-neon-gradient">perfil</span>
          </h1>
        </div>

        <Card className="p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Badge
              variant={user.plan === 'free' ? 'zinc' : user.plan === 'black' ? 'black' : 'premium'}
            >
              {user.plan === 'free' ? 'Free' : user.plan === 'black' ? 'Black' : 'Premium'}
            </Badge>
            <Badge variant="zinc">{roleLabels[user.role]}</Badge>
            <Badge variant="neon">Faixa {BELT_THEMES[user.belt].label}</Badge>
            {user.athleteCategory === 'kids' && <Badge variant="premium">Kids</Badge>}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <AvatarUpload value={avatar} onChange={setAvatar} />

            <Input
              label="Nome"
              autoComplete="name"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input label="E-mail" value={user.email} disabled readOnly />

            {user.role === 'atleta' && (
              <>
                <div>
                  <p className="mb-3 text-sm font-medium text-zinc-300">Tipo de atleta</p>
                  <AthleteCategoryPicker value={athleteCategory} onChange={handleCategoryChange} />
                </div>
                {athleteCategory === 'kids' && (
                  <>
                    <Input
                      label="Nome completo do pai (ou responsável)"
                      placeholder="Ex.: Carlos Eduardo Silva"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                    />
                    <Input
                      label="CPF do responsável"
                      placeholder="000.000.000-00"
                      value={guardianCpf}
                      onChange={(e) => setGuardianCpf(formatCpf(e.target.value))}
                    />
                  </>
                )}
              </>
            )}

            <div>
              <p className="mb-3 text-sm font-medium text-zinc-300">Faixa</p>
              <BeltPicker
                value={belt}
                onChange={setBelt}
                category={user.role === 'atleta' ? athleteCategory : 'adulto'}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Grau (listras)"
                type="number"
                min={0}
                max={4}
                error={errors.degree?.message}
                {...register('degree')}
              />
              <Input
                label={athleteCategory === 'kids' ? 'Peso do atleta (kg)' : 'Peso (kg)'}
                type="number"
                min={athleteCategory === 'kids' ? 15 : 30}
                max={athleteCategory === 'kids' ? 120 : 200}
                error={errors.weightKg?.message}
                {...register('weightKg')}
              />
            </div>

            <Input
              label="Academia / filiação"
              placeholder="Ex.: Gracie Barra Fortaleza"
              error={errors.academyName?.message}
              {...register('academyName')}
            />

            {error && <p className="text-sm text-red-400">{error}</p>}
            {saved && (
              <p className="text-sm text-neon">Perfil atualizado com sucesso.</p>
            )}

            <Button type="submit" loading={submitting} className="w-full sm:w-auto">
              <Save className="h-4 w-4" />
              Salvar alterações
            </Button>
          </form>
        </Card>
      </motion.div>
    </AppShell>
  );
}
