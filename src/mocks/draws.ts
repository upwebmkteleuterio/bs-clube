import { OfficialDraw } from '../types';

export const mockDraws: OfficialDraw[] = [
  {
    id: 'draw-2780',
    concurso: 'Concurso #2780',
    data: '18/06/2025',
    local: 'Espaço da Sorte, SP',
    dezenas: [4, 12, 23, 34, 46, 55],
    acumulado: false,
    premioEstimado: 35000000,
  },
  {
    id: 'draw-2779',
    concurso: 'Concurso #2779',
    data: '15/06/2025',
    local: 'Espaço da Sorte, SP',
    dezenas: [3, 15, 27, 35, 41, 53],
    acumulado: true,
    premioEstimado: 28000000,
  },
  {
    id: 'draw-2778',
    concurso: 'Concurso #2778',
    data: '12/06/2025',
    local: 'Espaço da Sorte, SP',
    dezenas: [1, 9, 21, 38, 44, 57],
    acumulado: false,
    premioEstimado: 19000000,
  },
  {
    id: 'draw-2777',
    concurso: 'Concurso #2777',
    data: '08/06/2025',
    local: 'Espaço da Sorte, SP',
    dezenas: [6, 17, 24, 33, 45, 52],
    acumulado: false,
    premioEstimado: 12000000,
  },
];
