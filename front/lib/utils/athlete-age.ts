import type { AthleteCategory } from '@/types';

/** Até 15 anos = categoria kids (IBJJF). */
export const KIDS_MAX_AGE = 15;

export function ageFromBirthDate(birthDate: string): number {
  const birth = new Date(`${birthDate}T12:00:00`);
  if (Number.isNaN(birth.getTime())) return -1;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

export function categoryFromBirthDate(birthDate: string): AthleteCategory {
  const age = ageFromBirthDate(birthDate);
  return age >= 0 && age <= KIDS_MAX_AGE ? 'kids' : 'adulto';
}

export function birthDateSchemaMessage(birthDate: string): string | null {
  const age = ageFromBirthDate(birthDate);
  if (age < 0) return 'Data de nascimento inválida';
  if (age > 100) return 'Confira a data de nascimento';
  return null;
}

/** Limite máximo do input date (hoje). */
export function maxBirthDateInput(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Sugestão de peso padrão conforme idade. */
export function defaultWeightForBirthDate(birthDate: string): number {
  const age = ageFromBirthDate(birthDate);
  if (age <= 8) return 30;
  if (age <= 12) return 40;
  if (age <= 15) return 50;
  return 70;
}
