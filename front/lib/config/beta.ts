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

/** Perguntas do Córtex ('o que aconteceu na luta') no Ajude a melhorar. Lucas 05/11 14:48: 'sobre a pergunta não vamos usar agora'. */
export const PERGUNTAS_CORTEX = process.env.NEXT_PUBLIC_PERGUNTAS_CORTEX === 'true';

/** Marcação início/fim da luta na barra do player. Lucas 05/11 14:50: 'não precisa de selecionar o trecho, deixar só na aba de relatar um problema'. O vídeo continua abrindo no início da luta. */
export const MARCAR_LUTA_NA_BARRA = process.env.NEXT_PUBLIC_MARCAR_LUTA_NA_BARRA === 'true';
