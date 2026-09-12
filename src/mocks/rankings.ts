import { RankingParticipant } from '../types';

export const mockParticipants: RankingParticipant[] = [
  { 
    id: 1, 
    gameId: 'bolao-bronze', 
    name: 'Você', 
    initials: 'VC', 
    numbers: [4, 15, 23, 33, 46, 60], 
    isMe: true 
  },
  { 
    id: 2, 
    gameId: 'bolao-bronze', 
    name: 'Marcos Silva', 
    initials: 'MS', 
    numbers: [4, 12, 23, 34, 41, 55] 
  },
  { 
    id: 3, 
    gameId: 'bolao-bronze', 
    name: 'Fernanda C.', 
    initials: 'FC', 
    numbers: [1, 12, 23, 30, 46, 50] 
  },
  { 
    id: 4, 
    gameId: 'bolao-bronze', 
    name: 'Roberto N.', 
    initials: 'RN', 
    numbers: [4, 12, 23, 34, 46, 55] 
  },
  { 
    id: 5, 
    gameId: 'bolao-bronze', 
    name: 'Carla R.', 
    initials: 'CR', 
    numbers: [5, 11, 22, 33, 44, 59] 
  },
  { 
    id: 6, 
    gameId: 'bolao-bronze', 
    name: 'Lucas A.', 
    initials: 'LA', 
    numbers: [4, 23, 34, 46, 55, 59] 
  },
  { 
    id: 7, 
    gameId: 'bolao-bronze', 
    name: 'Juliana M.', 
    initials: 'JM', 
    numbers: [12, 23, 46, 51, 55, 58] 
  },
  // Participants for bolão prata (BIG 20)
  { 
    id: 8, 
    gameId: 'bolao-prata', 
    name: 'Você', 
    initials: 'VC', 
    numbers: [4, 12, 23, 34, 46, 55], 
    isMe: true 
  },
  { 
    id: 9, 
    gameId: 'bolao-prata', 
    name: 'Diego M.', 
    initials: 'DM', 
    numbers: [4, 12, 23, 34, 40, 52] 
  },
  { 
    id: 10, 
    gameId: 'bolao-prata', 
    name: 'Amanda F.', 
    initials: 'AF', 
    numbers: [3, 12, 23, 34, 46, 55] 
  },
  { 
    id: 11, 
    gameId: 'bolao-prata', 
    name: 'Carlos E.', 
    initials: 'CE', 
    numbers: [5, 10, 20, 30, 40, 50] 
  },
  // Participants for bolão ouro (BIG 50)
  { 
    id: 12, 
    gameId: 'bolao-ouro', 
    name: 'Rodrigo B.', 
    initials: 'RB', 
    numbers: [4, 12, 23, 34, 46, 55] 
  },
  { 
    id: 13, 
    gameId: 'bolao-ouro', 
    name: 'Patrícia L.', 
    initials: 'PL', 
    numbers: [4, 12, 23, 34, 46, 58] 
  },
  { 
    id: 14, 
    gameId: 'bolao-ouro', 
    name: 'Você', 
    initials: 'VC', 
    numbers: [2, 12, 23, 34, 45, 55], 
    isMe: true 
  }
];
