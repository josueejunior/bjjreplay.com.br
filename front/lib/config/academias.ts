// Academias credenciadas no sistema, escolhidas no cadastro ("Academia vinculada").
// Hoje só uma (Lucas, 04/11/2026: "só bota Aliança Parnaíba"). Lucas quer, no futuro, usar a localização
// para identificar os locais credenciados: por isso cada academia já guarda cidade/UF.
export interface Academia {
  nome: string;
  cidade: string;
  uf: string;
}

export const ACADEMIAS_CREDENCIADAS: Academia[] = [{ nome: 'Aliança Parnaíba', cidade: 'Parnaíba', uf: 'PI' }];

export const ACADEMIAS = ACADEMIAS_CREDENCIADAS.map((a) => a.nome);
