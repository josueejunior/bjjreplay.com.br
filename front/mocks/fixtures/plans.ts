import type { Plan } from '@/types';

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceLabel: 'R$ 0',
    description: 'Para começar a treinar com a comunidade.',
    features: [
      '3 vídeos por semana',
      'Estatísticas básicas',
      'Perfil de atleta',
      'Badges iniciais',
    ],
    highlighted: false,
    cta: 'Começar grátis',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 29.9,
    priceLabel: 'R$ 29,90',
    description: 'Acesso total para evoluir de verdade.',
    features: [
      'Vídeos ilimitados',
      'Downloads em HD',
      'Estatísticas avançadas',
      'Todos os badges e ranking',
      'Sem anúncios',
    ],
    highlighted: true,
    cta: 'Assinar Premium',
  },
  {
    id: 'black',
    name: 'Black',
    price: 59.9,
    priceLabel: 'R$ 59,90',
    description: 'Experiência elite com benefícios exclusivos.',
    features: [
      'Tudo do Premium',
      'Vídeos em 4K',
      'Análise de performance com IA',
      'Acesso antecipado a recursos',
      'Suporte prioritário',
      'Badge Black exclusivo',
    ],
    highlighted: false,
    cta: 'Virar Black',
  },
];
