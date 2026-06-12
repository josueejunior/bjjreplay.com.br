/** Compara academias ignorando maiúsculas e espaços extras. */
export function normalizeAcademyName(name: string | null | undefined): string {
  return (name ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
}

export function academyNamesMatch(
  a: string | null | undefined,
  b: string | null | undefined
): boolean {
  const na = normalizeAcademyName(a);
  const nb = normalizeAcademyName(b);
  return na.length > 0 && na === nb;
}
