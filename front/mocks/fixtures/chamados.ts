import type { ChamadoAdmin } from '@/types';

const diego = { id: 'u-diego', nome: 'Diego Fernandes', email: 'diego.fernandes@exemplo.com' };
const paula = { id: 'u-paula', nome: 'Paula Ribeiro', email: 'paula.ribeiro@exemplo.com' };
const marcos = { id: 'u-marcos', nome: 'Marcos Araújo', email: 'marcos.araujo@exemplo.com' };

export const chamadosIniciais: ChamadoAdmin[] = [
  {
    id: 'c1', tipo: 'erro', tela: 'Replay (player)', atleta: diego, extra: null, temPrint: false,
    texto: 'Toquei em “Assistir” e o vídeo ficou girando sem abrir. No Wi-Fi da academia e no 4G.',
    status: 'recebido', resposta: null, criadoEm: '2026-11-04T19:42:00Z', atualizadoEm: '2026-11-04T19:42:00Z',
  },
  {
    id: 'c2', tipo: 'luta_nao_encontrada', tela: null, atleta: diego, extra: { data: '2026-11-03', aula: 'Adulto 19h', tatame: 'Tatame 1', faltaram: 2, horario: '19:40', adversario: null, foraDoPrazo: false }, temPrint: false,
    texto: 'Lutei duas vezes na aula das 19h e nenhuma apareceu na minha biblioteca.',
    status: 'procurando', resposta: 'Estamos procurando nas gravações de ontem. Te aviso aqui.', criadoEm: '2026-11-04T01:10:00Z', atualizadoEm: '2026-11-04T13:20:00Z',
  },
  {
    id: 'c3', tipo: 'erro', tela: 'Perfil / cadastro', atleta: marcos, extra: null, temPrint: false,
    texto: 'Troquei minha faixa para azul e a tela voltou para branca depois de salvar.',
    status: 'resolvido', resposta: 'Corrigido hoje cedo. Pode conferir o seu perfil.', criadoEm: '2026-11-02T14:05:00Z', atualizadoEm: '2026-11-03T11:00:00Z',
  },
];
