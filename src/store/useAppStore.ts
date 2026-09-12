import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthMode = 'guest' | 'auth';

export interface GameLobbyItem {
  id: string;
  nome: string;
  buyIn: number;
  premio: number;
  velocidade: string;
  tipo: string;
  estado: 'Aberto' | 'Reg. Tardio' | 'Encerrado';
  inscritosAtuais: number;
  inscritosMax: number;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'prize' | 'bet' | 'withdraw';
  title: string;
  date: string;
  value: number;
  status: string;
}

interface AppState {
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  
  balanceTotal: number;
  balanceWithdrawable: number;
  balanceBonus: number;
  transactions: Transaction[];
  subscribedGames: string[];
  userNickname: string;
  setUserNickname: (nickname: string) => void;
  
  addDeposit: (amount: number) => void;
  addWithdrawal: (amount: number) => void;
  addTransaction: (tx: Transaction) => void;
  toggleSubscribeGame: (gameId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      authMode: 'guest',
      setAuthMode: (mode) => set({ authMode: mode }),
      
      balanceTotal: 50.00,
      balanceWithdrawable: 40.00,
      balanceBonus: 10.00,
      transactions: [
        { id: 'TRX-998A21', type: 'prize', title: 'Prêmio BIG 10', date: 'Hoje, 10:15', value: 32.50, status: 'success' },
        { id: 'TRX-871B04', type: 'bet', title: 'Aposta Mesa #02', date: 'Hoje, 09:30', value: -10.00, status: 'success' },
        { id: 'TRX-422C99', type: 'deposit', title: 'Depósito Pix', date: 'Ontem, 14:20', value: 27.50, status: 'success' },
        { id: 'TRX-112D45', type: 'withdraw', title: 'Saque Pix', date: '10 Ago, 18:00', value: -50.00, status: 'success' }
      ],
      subscribedGames: ['bolao-prata'],
      userNickname: 'Maicon',
      setUserNickname: (nickname) => set({ userNickname: nickname }),
      
      addDeposit: (amount) => set((state) => ({
        balanceTotal: state.balanceTotal + amount,
        balanceWithdrawable: state.balanceWithdrawable + amount
      })),
      
      addWithdrawal: (amount) => set((state) => ({
        balanceTotal: state.balanceTotal - amount,
        balanceWithdrawable: state.balanceWithdrawable - amount
      })),
      
      addTransaction: (tx) => set((state) => ({
        transactions: [tx, ...state.transactions]
      })),

      toggleSubscribeGame: (gameId) => set((state) => ({
        subscribedGames: state.subscribedGames.includes(gameId)
          ? state.subscribedGames.filter(id => id !== gameId)
          : [...state.subscribedGames, gameId]
      })),
    }),
    {
      name: 'bs-clube-storage',
    }
  )
);
