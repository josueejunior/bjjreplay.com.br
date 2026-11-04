// Beta gratuito da academia: liga/desliga a cobrança por esta variável.
// É lida na hora do build do Next (NEXT_PUBLIC_*): mudar o valor exige rebuild e reinício,
// mas não exige mexer no código. Ligado = sem preço, plano nem botão de assinar.
export const BETA_GRATUITO = process.env.NEXT_PUBLIC_BETA_GRATUITO === 'true';
