import type { AdminImage } from '@/types';

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

export const adminImages: AdminImage[] = [
  {
    id: 'img1',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
    uploadedAt: daysAgo(0),
    uploadedBy: 'carla.mendes',
    category: null,
  },
  {
    id: 'img2',
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80',
    uploadedAt: daysAgo(0),
    uploadedBy: 'rafael.souza',
    category: null,
  },
  {
    id: 'img3',
    imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&q=80',
    uploadedAt: daysAgo(1),
    uploadedBy: 'juliana.reis',
    category: null,
  },
  {
    id: 'img4',
    imageUrl: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=600&q=80',
    uploadedAt: daysAgo(1),
    uploadedBy: 'pedro.lima',
    category: null,
  },
  {
    id: 'img5',
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80',
    uploadedAt: daysAgo(2),
    uploadedBy: 'amanda.costa',
    category: null,
  },
  {
    id: 'img6',
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80',
    uploadedAt: daysAgo(2),
    uploadedBy: 'equipe.volt',
    category: null,
  },
  {
    id: 'img7',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    uploadedAt: daysAgo(3),
    uploadedBy: 'lia.tanaka',
    category: null,
  },
  {
    id: 'img8',
    imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&q=80',
    uploadedAt: daysAgo(4),
    uploadedBy: 'marcos.vieira',
    category: null,
  },
  {
    id: 'img9',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
    uploadedAt: daysAgo(5),
    uploadedBy: 'bruno.dias',
    category: null,
  },
  {
    id: 'img10',
    imageUrl: 'https://images.unsplash.com/photo-1486218119243-13883505764c?w=600&q=80',
    uploadedAt: daysAgo(5),
    uploadedBy: 'sofia.alves',
    category: null,
  },
];
