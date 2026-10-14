import type { AthleteCategory } from '../types.js';

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
