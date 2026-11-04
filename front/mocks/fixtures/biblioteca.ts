import type { FotoBiblioteca, LutaBiblioteca } from '@/types';



/**
 * Lutas de demonstração do beta (janela da luta no vídeo): ligue com localStorage 'mock_lutas_beta'='1' (o MSW roda no navegador).
 * O arquivo tem 3 min e a luta vai de 1:00 a 2:00 (1 min antes e 1 min depois), como no briefing.
 */
const LUTAS_DEMO_BETA: LutaBiblioteca[] = [
  {
    id_luta: 9001,
    status: 'ENTREGUE',
    url_horizontal: '/demo/demo-luta.mp4',
    data: '2026-11-03',
    opponent_name: 'Rafael Menezes',
    opponent_belt: 'roxa',
    event_name: 'Treino aberto — Aliança Parnaíba',
    event_city: 'Parnaíba',
    belt_at_fight: 'roxa',
    category: 'Adulto · Médio',
    inicio_luta_s: 60,
    fim_luta_s: 120,
  },
  {
    id_luta: 9002,
    status: 'ENTREGUE',
    url_horizontal: '/demo/demo-luta.mp4',
    data: '2026-11-01',
    opponent_name: 'Thiago Barros',
    opponent_belt: 'azul',
    event_name: 'Treino aberto — Aliança Parnaíba',
    event_city: 'Parnaíba',
    belt_at_fight: 'roxa',
    category: 'Adulto · Médio',
  },
  {
    // Janela inválida (fim antes do início): o player tem que ignorar e abrir do começo.
    id_luta: 9003,
    status: 'ENTREGUE',
    url_horizontal: '/demo/demo-luta.mp4',
    data: '2026-10-30',
    opponent_name: 'Davi Carvalho',
    opponent_belt: 'branca',
    event_name: 'Treino aberto — Aliança Parnaíba',
    event_city: 'Parnaíba',
    belt_at_fight: 'roxa',
    category: 'Adulto · Médio',
    inicio_luta_s: 90,
    fim_luta_s: 30,
  },
];

/** MSW — biblioteca vazia (sem dados demo), salvo com localStorage 'mock_lutas_beta'='1'. */

export function advanceMockBiblioteca(): LutaBiblioteca[] {

  try {
    return window.localStorage.getItem('mock_lutas_beta') === '1' ? LUTAS_DEMO_BETA : [];
  } catch {
    return [];
  }

}



export function getMockProfessorBiblioteca(): LutaBiblioteca[] {

  return [];

}



export function getMockBibliotecaFotos(): FotoBiblioteca[] {

  return [

    {

      id_foto: 1001,

      url: '/images/landing/bjj-roll.jpg',

      data: '2026-05-18',

      caption: 'Treino no tatame',

      event_name: 'Open Interno GB',

    },

    {

      id_foto: 1002,

      url: '/images/landing/bjj-competition.jpg',

      data: '2026-05-12',

      caption: 'Momento da luta',

      event_name: 'Copa Fortaleza',

    },

    {

      id_foto: 1003,

      url: '/images/landing/bjj-grappling.jpg',

      data: '2026-04-28',

      caption: 'Passagem de guarda',

      event_name: 'Treino livre',

    },

    {

      id_foto: 1004,

      url: '/images/landing/bjj-mat.jpg',

      data: '2026-04-15',

      caption: 'Kimono e tatame',

      event_name: 'Academia',

    },

  ];

}



export function resetMockBiblioteca() {

  // noop

}

