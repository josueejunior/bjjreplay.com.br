// Beta gratuito da academia: liga/desliga a cobrança por esta variável.
// É lida na hora do build do Next (NEXT_PUBLIC_*): mudar o valor exige rebuild e reinício,
// mas não exige mexer no código. Ligado = sem preço, plano nem botão de assinar.
export const BETA_GRATUITO = process.env.NEXT_PUBLIC_BETA_GRATUITO === 'true';

/**
 * Até quantos dias para trás vale "Não encontrei minha luta". Lucas (04/11/2026): áudio das 17:44 falou
 * "10 dias" e "quinta da semana passada" (~7); às 18:18 escreveu "7 dias". Configurável sem mexer no código
 * (NEXT_PUBLIC_LIMITE_DIAS_LUTA no front; CHAMADOS_LIMITE_DIAS no back — mantenha os dois iguais).
 */
export const LIMITE_DIAS_LUTA = Number(process.env.NEXT_PUBLIC_LIMITE_DIAS_LUTA ?? 7) || 7;
