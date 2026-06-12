/** Remove máscara e mantém só dígitos. */
export function cpfDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11);
}

/** Formata CPF enquanto digita: 000.000.000-00 */
export function formatCpf(value: string): string {
  const d = cpfDigits(value);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function isValidCpf(raw: string): boolean {
  const cpf = cpfDigits(raw);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === Number(cpf[10]);
}

export function maskCpf(raw: string | null | undefined): string {
  const d = cpfDigits(raw ?? '');
  if (d.length < 11) return formatCpf(d);
  return `***.***.${d.slice(6, 9)}-${d.slice(9)}`;
}
