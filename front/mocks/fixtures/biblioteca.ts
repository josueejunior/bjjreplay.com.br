import type { FotoBiblioteca, LutaBiblioteca } from '@/types';



/** MSW — biblioteca vazia (sem dados demo). */

export function advanceMockBiblioteca(): LutaBiblioteca[] {

  return [];

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

