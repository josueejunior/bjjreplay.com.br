import type { Video } from '@/types';

// Vídeos de exemplo (Google sample videos, royalty-free)
const SAMPLE_H =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';
const SAMPLE_H2 =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4';
const SAMPLE_H3 =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

export const videos: Video[] = [
  {
    id: 'v1',
    title: 'Treino HIIT — Explosão de 15 minutos',
    description:
      'Sessão intensa de HIIT para queimar calorias e melhorar o condicionamento. Sem equipamentos.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    videoUrl: SAMPLE_H,
    durationSeconds: 912,
    orientation: 'horizontal',
    locked: false,
    requiredPlan: 'free',
    createdAt: daysAgo(0),
    views: 12840,
    author: { name: 'Carla Mendes', avatarUrl: 'https://i.pravatar.cc/100?img=47' },
  },
  {
    id: 'v2',
    title: 'Corrida de rua: técnica de passada',
    description:
      'Aprenda a corrigir sua passada e reduzir o impacto nos joelhos em corridas longas.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80',
    videoUrl: SAMPLE_H2,
    durationSeconds: 645,
    orientation: 'horizontal',
    locked: false,
    requiredPlan: 'free',
    createdAt: daysAgo(1),
    views: 8932,
    author: { name: 'Rafael Souza', avatarUrl: 'https://i.pravatar.cc/100?img=12' },
  },
  {
    id: 'v3',
    title: 'Mobilidade de quadril para ciclistas',
    description:
      'Rotina de 10 minutos para destravar o quadril e pedalar com mais potência.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80',
    videoUrl: SAMPLE_H3,
    durationSeconds: 588,
    orientation: 'vertical',
    locked: true,
    requiredPlan: 'premium',
    createdAt: daysAgo(2),
    views: 15201,
    author: { name: 'Juliana Reis', avatarUrl: 'https://i.pravatar.cc/100?img=32' },
  },
  {
    id: 'v4',
    title: 'Força para corredores: posterior de coxa',
    description:
      'Fortaleça isquiotibiais e glúteos para correr mais rápido e sem lesões.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=800&q=80',
    videoUrl: SAMPLE_H,
    durationSeconds: 1230,
    orientation: 'horizontal',
    locked: true,
    requiredPlan: 'premium',
    createdAt: daysAgo(3),
    views: 22104,
    author: { name: 'Pedro Lima', avatarUrl: 'https://i.pravatar.cc/100?img=15' },
  },
  {
    id: 'v5',
    title: 'Natação: respiração bilateral',
    description:
      'Domine a respiração bilateral no crawl e nade com mais eficiência.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80',
    videoUrl: SAMPLE_H2,
    durationSeconds: 754,
    orientation: 'horizontal',
    locked: false,
    requiredPlan: 'free',
    createdAt: daysAgo(5),
    views: 6420,
    author: { name: 'Amanda Costa', avatarUrl: 'https://i.pravatar.cc/100?img=44' },
  },
  {
    id: 'v6',
    title: 'Análise de performance com IA — Sprint',
    description:
      'Veja como a IA analisa sua biomecânica de sprint quadro a quadro.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
    videoUrl: SAMPLE_H3,
    durationSeconds: 1820,
    orientation: 'vertical',
    locked: true,
    requiredPlan: 'black',
    createdAt: daysAgo(6),
    views: 31550,
    author: { name: 'Equipe Volt', avatarUrl: 'https://i.pravatar.cc/100?img=68' },
  },
  {
    id: 'v7',
    title: 'Yoga pós-treino: recuperação ativa',
    description:
      'Sequência de yoga de 20 minutos para acelerar a recuperação muscular.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    videoUrl: SAMPLE_H,
    durationSeconds: 1205,
    orientation: 'horizontal',
    locked: false,
    requiredPlan: 'free',
    createdAt: daysAgo(8),
    views: 9876,
    author: { name: 'Lia Tanaka', avatarUrl: 'https://i.pravatar.cc/100?img=25' },
  },
  {
    id: 'v8',
    title: 'Periodização de treino para maratona',
    description:
      'Plano completo de 16 semanas para sua primeira maratona, semana a semana.',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80',
    videoUrl: SAMPLE_H2,
    durationSeconds: 2410,
    orientation: 'horizontal',
    locked: true,
    requiredPlan: 'premium',
    createdAt: daysAgo(10),
    views: 18760,
    author: { name: 'Marcos Vieira', avatarUrl: 'https://i.pravatar.cc/100?img=53' },
  },
];
