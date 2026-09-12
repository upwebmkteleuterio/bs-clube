export interface Game {
  id: string;
  nome: string;
  buyIn: number;
  premio: number;
  velocidade: string;
  tipo: string;
  estado: 'Aberto' | 'Reg. Tardio' | 'Encerrado';
  inscritosAtuais: number;
  inscritosMax: number;
  categoria?: string;
  concursoRef?: string;
  dataEncerramento?: string;
  createdAt?: string;
}

// Alias for backward compatibility if needed
export type GameLobbyItem = Game;

export interface OfficialDraw {
  id: string;
  concurso: string;
  data: string;
  local: string;
  dezenas: number[];
  acumulado?: boolean;
  premioEstimado?: number;
}

export interface RankingParticipant {
  id: number | string;
  gameId: string;
  name: string;
  initials: string;
  isMe?: boolean;
  hits: number;
}

export interface UserTransaction {
  id: string;
  type: 'deposit' | 'prize' | 'bet' | 'withdraw';
  title: string;
  date: string;
  value: number;
  status: 'pending' | 'success' | 'failed' | string;
  pixKey?: string;
  pixKeyType?: string;
}

export interface WalletBalance {
  total: number;
  withdrawable: number;
  bonus: number;
}

export interface BolaoDetails {
  id: string;
  nome: string;
  lottery: string;
  concurso: string;
  concursoRef: string;
  mesaName: string;
  dataSorteio: string;
  horarioSorteio: string;
  cotaPrice: number;
  vagasPreenchidas: number;
  vagasTotal: number;
  estado: 'Aberta' | 'Encerrada' | 'Em Andamento';
  minNumbers: number;
  maxNumbers: number;
  totalLotteryNumbers: number; // 60 for Mega-Sena
  descricao: string;
}

export interface UserBet {
  id: string;
  bolaoId: string;
  numbers: number[];
  createdAt: string;
  cotaPrice: number;
}

export interface UserProfile {
  id: string;
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ProfileUpdate = Pick<UserProfile, 'fullName' | 'phone' | 'avatarUrl'>;

export interface AdminWithdrawal {
  id: string;
  user: string;
  amount: number;
  date: string;
  pixKey: string;
  pixType: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AdminUser {
  id: number | string;
  name: string;
  phone: string;
  balance: number;
  bonus: number;
  active: boolean;
  createdAt?: string;
}

export interface AdminCategory {
  id: number | string;
  name: string;
  cota: number;
  vagas: number;
  filled: number;
  drawDate: string;
  status: 'em_andamento' | 'concluido' | 'inativo';
}

export interface AdminFinancialMetrics {
  totalArrecadado: number;
  lucroRetido: number;
  lucroPercent: number;
  premiosPagos: number;
  premiosPercent: number;
  apostadoresAtivos: number;
}

export interface ManualDrawInput {
  concurso: string;
  data: string;
  dezenas: number[];
}
