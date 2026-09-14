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
  minNumbers?: number;
  maxNumbers?: number;
  totalLotteryNumbers?: number;
  quotaId?: string;
  isUnavailable?: boolean;
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

export type PixKeyType = 'cpf' | 'email' | 'phone' | 'random';

export interface UserProfile {
  id: string;
  fullName: string | null;
  phone: string | null;
  cpf: string | null;
  avatarUrl: string | null;
  pixKeyType: PixKeyType | null;
  pixKey: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileUpdate {
  fullName: string;
  phone: string;
  avatarUrl: string | null;
  pixKeyType?: PixKeyType | null;
  pixKey?: string | null;
}

export type WalletTransactionFilter = 'all' | 'deposit' | 'prize' | 'bet' | 'withdraw';

export interface WalletActivityPage {
  items: UserTransaction[];
  totalCount: number;
  page: number;
  pageSize: number;
}

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

export type AdminUserStatus = 'all' | 'active' | 'blocked';

export interface AdminUsersQuery {
  page: number;
  pageSize: number;
  search: string;
  status: AdminUserStatus;
}

export interface AdminUsersPage {
  items: AdminUser[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface PrizeSettings {
  housePercentage: number;
  winnerPercentage: number;
}

export interface Quota {
  id: string;
  name: string;
  amount: number;
  isActive: boolean;
  createdAt?: string;
}

export interface QuotaInput {
  name: string;
  amount: number;
}

export type AdminCategoryStatus = 'open' | 'closed' | 'completed';

export interface AdminCategory {
  id: number | string;
  poolId?: string;
  drawId?: string;
  quotaId?: string;
  name: string;
  concurso?: string;
  cota: number;
  vagas: number;
  filled: number;
  drawDate: string;
  minNumbers?: number;
  maxNumbers?: number;
  numbers?: number[];
  housePercentage: number;
  winnerPercentage: number;
  poolStatus: AdminCategoryStatus;
  status: 'em_andamento' | 'finalizado' | 'concluido' | 'inativo';
}

export interface AdminCategoriesQuery {
  page: number;
  pageSize: number;
  status: AdminCategoryStatus;
  month: string;
}

export interface AdminCategoriesPage {
  items: AdminCategory[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface AdminCategoryInput {
  name: string;
  concurso: string;
  quotaId: string;
  vagas: number;
  drawDate: string;
  numbersPerBet: number;
  housePercentage: number;
  winnerPercentage: number;
}

export interface RegisterResultInput {
  poolId: string;
  drawId: string;
  drawDate: string;
  dezenas: number[];
}

export interface RegisterResultOutcome {
  gross: number;
  house: number;
  winners: number;
  winnerCount: number;
  category: AdminCategory;
}

export interface AdminResultDetail {
  pool: {
    id: string;
    name: string;
    buyIn: number;
    filledSlots: number;
    totalSlots: number;
    housePercentage: number;
    winnerPercentage: number;
    status: string;
    createdAt?: string;
  };
  draw: {
    id: string;
    contest: string;
    drawDate: string;
    numbers: number[];
  };
  settlement: {
    id: string;
    grossAmount: number;
    houseAmount: number;
    winnersAmount: number;
    winnerCount: number;
    status: string;
    createdAt?: string;
  };
  participantsCount: number;
  betsCount: number;
  winners: AdminResultWinner[];
}

export interface AdminResultWinner {
  awardId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  pixKeyType: string;
  pixKey: string;
  hits: number;
  amount: number;
  numbers: number[];
  playedAt: string;
  awardedAt: string;
}

export interface PrizeAward {
  id: string;
  poolId: string;
  purchasedBetId: string;
  hits: number;
  amount: number;
  createdAt: string;
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
