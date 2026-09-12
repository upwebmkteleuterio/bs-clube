import { BolaoDetails, UserBet } from '../types';

export const initialBolaoDetails: BolaoDetails = {
  id: 'bolao-big-10',
  nome: 'Sorteio BIG 10',
  lottery: 'MEGA-SENA',
  concurso: '2780',
  concursoRef: 'Concurso #2780 • Caixa',
  mesaName: 'Mesa Ativa #01',
  dataSorteio: 'Sábado',
  horarioSorteio: '20:00',
  cotaPrice: 10.0,
  vagasPreenchidas: 12,
  vagasTotal: 100,
  estado: 'Aberta',
  minNumbers: 6,
  maxNumbers: 6,
  totalLotteryNumbers: 60,
  descricao: 'Marque 6 dezenas ou gere múltiplos jogos nesta mesma tela para concorrer.',
};

export const initialUserBets: UserBet[] = [
  {
    id: 'bet-initial-01',
    bolaoId: 'bolao-big-10',
    numbers: [4, 11, 23, 35, 42, 58],
    createdAt: 'Hoje, 09:30',
    cotaPrice: 10.0,
  },
];
