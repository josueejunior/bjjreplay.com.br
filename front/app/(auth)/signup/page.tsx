'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Cake, ScanFace } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Stepper } from '@/components/auth/Stepper';
import { BeltPicker } from '@/components/auth/BeltPicker';
import { AvatarUpload } from '@/components/auth/AvatarUpload';
import { isBeltValidForCategory } from '@/lib/bjj/belt-theme';
import { useAuth } from '@/lib/hooks/useAuth';
import { updateProfile } from '@/lib/api/endpoints';
import {
  ageFromBirthDate,
  birthDateSchemaMessage,
  categoryFromBirthDate,
  defaultWeightForBirthDate,
  maxBirthDateInput,
} from '@/lib/utils/athlete-age';
import { cpfDigits, formatCpf, isValidCpf } from '@/lib/utils/cpf';
import type { FaixaBelt } from '@/types';

const credentialsSchema = z
  .object({
    name: z.string().min(2, 'Nome completo obrigatório'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Mínimo de 6 caracteres'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'As senhas não coincidem',
    path: ['confirm'],
  });

const birthDateSchema = z.object({
  birthDate: z.string().min(1, 'Informe a data de nascimento'),
});

const profileSchema = z
  .object({
    degree: z.coerce.number().min(0).max(4),
    weightKg: z.coerce.number().min(15, 'Peso mínimo 15 kg').max(200, 'Peso máximo 200 kg'),
    academyName: z.string().min(2, 'Informe sua academia'),
    guardianCpf: z.string().optional(),
    guardianName: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.guardianCpf && !isValidCpf(data.guardianCpf)) {
      ctx.addIssue({ code: 'custom', message: 'CPF inválido', path: ['guardianCpf'] });
    }
    if (data.guardianName && data.guardianName.trim().length < 2) {
      ctx.addIssue({
        code: 'custom',
        message: 'Nome completo obrigatório',
        path: ['guardianName'],
      });
    }
  });

type Credentials = z.infer<typeof credentialsSchema>;
type BirthDateForm = z.infer<typeof birthDateSchema>;
type ProfileForm = z.infer<typeof profileSchema>;

const STEPS = ['Conta', 'Nascimento', 'Perfil BJJ', 'Foto IA'];

const stepVariants = {
  enter: { opacity: 0, x: 32 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
};

function SignupFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const { signUp, updateProfile: updateLocalProfile } = useAuth();

  const [step, setStep] = useState(0);
  const [birthDate, setBirthDate] = useState('');
  const [belt, setBelt] = useState<FaixaBelt | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [guardianNameError, setGuardianNameError] = useState<string | null>(null);

  const athleteCategory = useMemo(
    () => (birthDate ? categoryFromBirthDate(birthDate) : 'adulto'),
    [birthDate]
  );
  const athleteAge = birthDate ? ageFromBirthDate(birthDate) : null;
  const isKids = athleteCategory === 'kids';

  const credentialsForm = useForm<Credentials>({ resolver: zodResolver(credentialsSchema) });
  const birthDateForm = useForm<BirthDateForm>({
    resolver: zodResolver(birthDateSchema),
    defaultValues: { birthDate: '' },
  });
  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { degree: 0, weightKg: 70, academyName: '', guardianCpf: '', guardianName: '' },
  });

  const onCredentials = async (data: Credentials) => {
    setSubmitting(true);
    setError(null);
    const err = await signUp(data.email, data.password);
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    updateLocalProfile({ name: data.name });
    setStep(1);
  };

  const onBirthDate = (data: BirthDateForm) => {
    const message = birthDateSchemaMessage(data.birthDate);
    if (message) {
      birthDateForm.setError('birthDate', { message });
      return;
    }

    const category = categoryFromBirthDate(data.birthDate);
    setBirthDate(data.birthDate);
    profileForm.setValue('weightKg', defaultWeightForBirthDate(data.birthDate));

    if (belt && !isBeltValidForCategory(belt, category)) {
      setBelt(null);
    }
    if (category === 'adulto') {
      profileForm.setValue('guardianCpf', '');
      profileForm.setValue('guardianName', '');
      setCpfError(null);
      setGuardianNameError(null);
    }

    setStep(2);
  };

  const onProfile = async (data: ProfileForm) => {
    if (!belt) return;

    if (isKids) {
      const guardianName = data.guardianName?.trim().replace(/\s+/g, ' ') ?? '';
      if (!guardianName || guardianName.length < 2) {
        setGuardianNameError('Informe o nome completo do pai ou responsável');
        return;
      }
      setGuardianNameError(null);

      if (!data.guardianCpf || !isValidCpf(data.guardianCpf)) {
        setCpfError('Informe o CPF válido do pai, mãe ou responsável');
        return;
      }
      setCpfError(null);
    }

    setStep(3);
    profileForm.reset({ ...data });
  };

  const onFinish = async () => {
    const profile = profileForm.getValues();
    if (!belt || !birthDate) return;
    if (!avatar) {
      setError('Foto de rosto obrigatória — a IA precisa dela para te identificar nas lutas.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        belt,
        degree: profile.degree,
        weightKg: profile.weightKg,
        academyName: profile.academyName.trim().replace(/\s+/g, ' '),
        avatarUrl: avatar,
        sportLevel: 'iniciante' as const,
        birthDate,
        athleteCategory,
        guardianCpf: isKids ? cpfDigits(profile.guardianCpf ?? '') : null,
        guardianName: isKids ? profile.guardianName?.trim().replace(/\s+/g, ' ') ?? null : null,
      };
      await updateProfile(payload);
      updateLocalProfile(payload);
      router.push('/biblioteca');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string }; status?: number } }).response?.data
              ?.detail ??
            ((err as { response?: { status?: number } }).response?.status === 413
              ? 'Foto muito grande. Escolha uma imagem menor ou tente novamente.'
              : null)
          : null;
      setError(message ?? 'Não foi possível salvar o perfil. Tente novamente.');
      setSubmitting(false);
    }
  };

  return (
    <Card className="animate-fade-in p-8">
      <div className="mb-2 text-center">
        <h1 className="text-xl font-bold text-white">Cadastro de atleta</h1>
        <p className="mt-1 text-xs text-zinc-500">
          A data de nascimento define faixas kids e dados do responsável
        </p>
        {plan && plan !== 'free' && (
          <div className="mt-2">
            <Badge variant={plan === 'black' ? 'black' : 'premium'}>
              Plano {plan === 'black' ? 'Black' : 'Premium'} selecionado
            </Badge>
          </div>
        )}
      </div>

      <Stepper steps={STEPS} current={step} />

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.form
            key="step-0"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            onSubmit={credentialsForm.handleSubmit(onCredentials)}
            className="flex flex-col gap-4"
          >
            <Input
              label="Nome completo"
              placeholder="João Silva"
              autoComplete="name"
              error={credentialsForm.formState.errors.name?.message}
              {...credentialsForm.register('name')}
            />
            <Input
              label="E-mail"
              type="email"
              placeholder="voce@email.com"
              autoComplete="email"
              error={credentialsForm.formState.errors.email?.message}
              {...credentialsForm.register('email')}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              error={credentialsForm.formState.errors.password?.message}
              {...credentialsForm.register('password')}
            />
            <Input
              label="Confirmar senha"
              type="password"
              placeholder="Repita a senha"
              autoComplete="new-password"
              error={credentialsForm.formState.errors.confirm?.message}
              {...credentialsForm.register('confirm')}
            />

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" loading={submitting} className="mt-2 w-full">
              Continuar <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.form>
        )}

        {step === 1 && (
          <motion.form
            key="step-1"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            onSubmit={birthDateForm.handleSubmit(onBirthDate)}
            className="flex flex-col gap-5"
          >
            <div className="rounded-xl border border-neon/20 bg-neon/5 p-4 text-center">
              <Cake className="mx-auto mb-2 h-8 w-8 text-neon" />
              <p className="text-sm text-zinc-300">Quando você nasceu?</p>
              <p className="mt-1 text-xs text-zinc-500">
                Atletas até 15 anos entram na categoria <strong className="text-sky-300">Kids</strong>{' '}
                com faixas infantis, CPF e nome do responsável.
              </p>
            </div>

            <Input
              label="Data de nascimento"
              type="date"
              max={maxBirthDateInput()}
              error={birthDateForm.formState.errors.birthDate?.message}
              {...birthDateForm.register('birthDate')}
            />

            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setStep(0)} className="flex-1">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              <Button type="submit" className="flex-1">
                Continuar <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form
            key="step-2"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            onSubmit={profileForm.handleSubmit(onProfile)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge variant={isKids ? 'premium' : 'zinc'}>
                {isKids ? 'Atleta Kids' : 'Adulto'}
              </Badge>
              {athleteAge !== null && athleteAge >= 0 && (
                <Badge variant="zinc">{athleteAge} anos</Badge>
              )}
            </div>

            {isKids && (
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 space-y-4">
                <Input
                  label="Nome completo do pai (ou responsável)"
                  placeholder="Ex.: Carlos Eduardo Silva"
                  autoComplete="name"
                  error={guardianNameError ?? profileForm.formState.errors.guardianName?.message}
                  {...profileForm.register('guardianName')}
                />
                <Input
                  label="CPF do pai, mãe ou responsável"
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  autoComplete="off"
                  error={cpfError ?? profileForm.formState.errors.guardianCpf?.message}
                  {...profileForm.register('guardianCpf', {
                    onChange: (e) => {
                      const formatted = formatCpf(e.target.value);
                      profileForm.setValue('guardianCpf', formatted, { shouldValidate: true });
                    },
                  })}
                />
                <p className="text-xs text-zinc-500">
                  Obrigatório para atletas kids (até 15 anos) — usado pela federação e academia.
                </p>
              </div>
            )}

            <BeltPicker value={belt} onChange={setBelt} category={athleteCategory} />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Grau (listras)"
                type="number"
                min={0}
                max={4}
                error={profileForm.formState.errors.degree?.message}
                {...profileForm.register('degree')}
              />
              <Input
                label={isKids ? 'Peso do atleta (kg)' : 'Peso (kg)'}
                type="number"
                min={isKids ? 15 : 30}
                max={isKids ? 120 : 200}
                error={profileForm.formState.errors.weightKg?.message}
                {...profileForm.register('weightKg')}
              />
            </div>

            <Input
              label="Academia / filiação"
              placeholder="Gracie Barra Fortaleza"
              error={profileForm.formState.errors.academyName?.message}
              {...profileForm.register('academyName')}
            />
            <p className="-mt-2 text-xs text-zinc-500">
              Use o mesmo nome da academia do professor para aparecer no painel dele.
            </p>

            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              <Button type="submit" disabled={!belt} className="flex-1">
                Continuar <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.form>
        )}

        {step === 3 && (
          <motion.div
            key="step-3"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-5"
          >
            <div className="rounded-xl border border-neon/20 bg-neon/5 p-4 text-center">
              <ScanFace className="mx-auto mb-2 h-8 w-8 text-neon" />
              <p className="text-sm text-zinc-300">
                Foto de rosto <strong className="text-neon">obrigatória</strong> — a IA usa para
                mapear {isKids ? 'o atleta' : 'você'} nas lutas
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Rosto visível, boa luz, sem óculos escuros. Enviada ao banco antes do campeonato.
              </p>
            </div>

            <AvatarUpload
              value={avatar}
              onChange={(value) => {
                setAvatar(value);
                if (value) setError(null);
              }}
              required
            />

            {error && <p className="text-center text-sm text-red-400">{error}</p>}

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(2)} className="flex-1">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              <Button loading={submitting} disabled={!avatar} onClick={onFinish} className="flex-1">
                Finalizar cadastro
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {step === 0 && (
        <p className="mt-6 text-center text-sm text-zinc-500">
          Já tem conta?{' '}
          <Link href="/login" className="font-medium text-neon transition-opacity hover:opacity-80">
            Entrar
          </Link>
        </p>
      )}
    </Card>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupFlow />
    </Suspense>
  );
}
