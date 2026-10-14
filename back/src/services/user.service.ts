import { randomUUID } from 'node:crypto';

import { db, insertGamificationStmt, insertUserStmt, rowToUser, type UserRow } from '../lib/db.js';
import { hashPassword } from '../lib/password.js';
import { normalizeAcademyName } from '../lib/academy.js';
import {
  createAlunoFromSignup,
  ensureAluno,
  findAlunoByEmail,
  findAlunoById,
  findStudentsByAcademy as sbFindStudentsByAcademy,
  isProfessor as sbIsProfessor,
  supabaseEnabled,
  updateAlunoProfile,
} from './supabase-store.service.js';
import type { AthleteCategory, FaixaBelt, PublicUser, SportLevel, User, UserRole } from '../types.js';
import { cpfDigits, isValidCpf } from '../lib/cpf.js';
import { categoryFromBirthDate } from '../lib/athlete-age.js';

const selectByEmail = db.prepare('SELECT * FROM users WHERE email = ?');
const selectById = db.prepare('SELECT * FROM users WHERE id = ?');
const countUsers = db.prepare('SELECT COUNT(*) AS n FROM users');

const updateProfileStmt = db.prepare(`
  UPDATE users SET
    sport_level = COALESCE(@sportLevel, sport_level),
    avatar_url = COALESCE(@avatarUrl, avatar_url),
    belt = COALESCE(@belt, belt),
    degree = COALESCE(@degree, degree),
    weight_kg = COALESCE(@weightKg, weight_kg),
    academy_name = COALESCE(@academyName, academy_name),
    name = COALESCE(@name, name),
    athlete_category = COALESCE(@athleteCategory, athlete_category),
    guardian_cpf = CASE WHEN @guardianCpfSet = 1 THEN @guardianCpf ELSE guardian_cpf END,
    guardian_name = CASE WHEN @guardianNameSet = 1 THEN @guardianName ELSE guardian_name END,
    birth_date = CASE WHEN @birthDateSet = 1 THEN @birthDate ELSE birth_date END
  WHERE id = @id
`);

function publicToUser(pub: PublicUser): User {
  return {
    ...pub,
    passwordHash: '',
    passwordSalt: '',
    createdAt: new Date().toISOString(),
  };
}

export function toPublicUser(user: User | PublicUser): PublicUser {
  const { passwordHash: _h, passwordSalt: _s, createdAt: _c, ...pub } = user as User;
  return pub;
}

export async function findByEmail(email: string): Promise<User | undefined> {
  if (supabaseEnabled()) {
    const pub = await findAlunoByEmail(email);
    return pub ? publicToUser(pub) : undefined;
  }
  const row = selectByEmail.get(email) as UserRow | undefined;
  return row ? rowToUser(row) : undefined;
}

export async function findById(id: string): Promise<User | undefined> {
  if (supabaseEnabled()) {
    const pub = await findAlunoById(id);
    return pub ? publicToUser(pub) : undefined;
  }
  const row = selectById.get(id) as UserRow | undefined;
  return row ? rowToUser(row) : undefined;
}

export async function createUser(email: string, password: string, name?: string): Promise<User> {
  if (supabaseEnabled()) {
    throw new Error('Use Supabase Auth para criar usuários');
  }

  const { hash, salt } = hashPassword(password);
  const user: User = {
    id: randomUUID(),
    email,
    name: name?.trim() || email.split('@')[0],
    passwordHash: hash,
    passwordSalt: salt,
    avatarUrl: null,
    sportLevel: 'iniciante',
    plan: 'free',
    isAdmin: false,
    createdAt: new Date().toISOString(),
    belt: 'branca',
    degree: 0,
    weightKg: null,
    academyName: null,
    role: 'atleta',
    athleteCategory: 'adulto',
    guardianCpf: null,
    guardianName: null,
    birthDate: null,
  };

  const total = (countUsers.get() as { n: number }).n;
  db.transaction(() => {
    insertUserStmt.run({
      ...user,
      isAdmin: 0,
      athleteCategory: user.athleteCategory,
      guardianCpf: user.guardianCpf,
      guardianName: user.guardianName,
      birthDate: user.birthDate,
    });
    insertGamificationStmt.run({
      userId: user.id,
      xp: 0,
      streakDays: 0,
      totalVideos: 0,
      totalMinutes: 0,
      weeklyRank: total + 40,
      earnedBadgeIds: '[]',
    });
  })();

  return user;
}

export async function ensureUserProfile(authUserId: string, email: string, name?: string): Promise<User> {
  const pub = await ensureAluno(authUserId, email, name);
  return publicToUser(pub);
}

export async function createUserFromAuth(authUserId: string, email: string, name?: string): Promise<User> {
  const pub = await createAlunoFromSignup(authUserId, email, name);
  return publicToUser(pub);
}

export async function updateProfile(
  userId: string,
  patch: {
    sportLevel?: SportLevel;
    avatarUrl?: string | null;
    belt?: FaixaBelt;
    degree?: number;
    weightKg?: number | null;
    academyName?: string | null;
    name?: string;
    athleteCategory?: AthleteCategory;
    guardianCpf?: string | null;
    guardianName?: string | null;
    birthDate?: string | null;
  },
): Promise<User | undefined> {
  if (supabaseEnabled()) {
    const pub = await updateAlunoProfile(userId, patch);
    return pub ? publicToUser(pub) : undefined;
  }

  const user = await findById(userId);
  if (!user) return undefined;

  if (patch.guardianCpf !== undefined && patch.guardianCpf !== null && !isValidCpf(patch.guardianCpf)) {
    throw new Error('CPF do responsável inválido');
  }

  const resolvedCategory =
    patch.athleteCategory ??
    (patch.birthDate ? categoryFromBirthDate(patch.birthDate) : user.athleteCategory);

  if (resolvedCategory === 'kids') {
    if (patch.guardianCpf === null) {
      throw new Error('CPF do responsável é obrigatório para atleta kids');
    }
    const cpf = patch.guardianCpf ?? user.guardianCpf;
    if (!cpf || !isValidCpf(cpf)) {
      throw new Error('CPF do responsável inválido');
    }
    const guardianName =
      patch.guardianName !== undefined
        ? patch.guardianName?.trim().replace(/\s+/g, ' ') ?? null
        : user.guardianName;
    if (!guardianName || guardianName.length < 2) {
      throw new Error('Nome completo do pai ou responsável é obrigatório para atleta kids');
    }
  }

  const normalizedGuardianName =
    patch.guardianName !== undefined
      ? patch.guardianName?.trim().replace(/\s+/g, ' ') ?? null
      : null;

  updateProfileStmt.run({
    id: userId,
    sportLevel: patch.sportLevel ?? null,
    avatarUrl: patch.avatarUrl !== undefined ? patch.avatarUrl : null,
    belt: patch.belt ?? null,
    degree: patch.degree ?? null,
    weightKg: patch.weightKg !== undefined ? patch.weightKg : null,
    academyName: patch.academyName !== undefined ? patch.academyName?.trim().replace(/\s+/g, ' ') ?? null : null,
    name: patch.name ?? null,
    athleteCategory: patch.birthDate ? categoryFromBirthDate(patch.birthDate) : patch.athleteCategory ?? null,
    guardianCpf:
      patch.guardianCpf !== undefined ? (patch.guardianCpf ? cpfDigits(patch.guardianCpf) : null) : null,
    guardianCpfSet: patch.guardianCpf !== undefined ? 1 : 0,
    guardianName: normalizedGuardianName,
    guardianNameSet: patch.guardianName !== undefined ? 1 : 0,
    birthDate: patch.birthDate !== undefined ? patch.birthDate : null,
    birthDateSet: patch.birthDate !== undefined ? 1 : 0,
  });

  return {
    ...user,
    sportLevel: patch.sportLevel ?? user.sportLevel,
    avatarUrl: patch.avatarUrl !== undefined ? patch.avatarUrl : user.avatarUrl,
    belt: patch.belt ?? user.belt,
    degree: patch.degree ?? user.degree,
    weightKg: patch.weightKg !== undefined ? patch.weightKg : user.weightKg,
    academyName: patch.academyName !== undefined ? patch.academyName : user.academyName,
    name: patch.name ?? user.name,
    athleteCategory: resolvedCategory,
    guardianCpf:
      patch.guardianCpf !== undefined
        ? patch.guardianCpf
          ? cpfDigits(patch.guardianCpf)
          : null
        : user.guardianCpf,
    guardianName: patch.guardianName !== undefined ? normalizedGuardianName : user.guardianName,
    birthDate: patch.birthDate !== undefined ? patch.birthDate : user.birthDate,
  };
}

export async function findStudentsByAcademy(academyName: string): Promise<User[]> {
  if (supabaseEnabled()) {
    const pubs = await sbFindStudentsByAcademy(academyName);
    return pubs.map(publicToUser);
  }
  const target = normalizeAcademyName(academyName);
  const rows = db.prepare(`SELECT * FROM users WHERE role = 'atleta'`).all() as UserRow[];
  return rows
    .filter((row) => normalizeAcademyName(row.academy_name) === target)
    .map(rowToUser);
}

export function isProfessor(user: User | PublicUser): boolean {
  if (supabaseEnabled()) return sbIsProfessor(user as PublicUser);
  return user.role === 'professor' || user.isAdmin;
}

export type { UserRole };
