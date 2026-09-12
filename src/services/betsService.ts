import { BolaoDetails, UserBet } from '../types';
import { initialBolaoDetails, initialUserBets } from '../mocks/bets';

const BOLAO_STORAGE_KEY = 'bs_clube_bolao_details';
const BETS_STORAGE_KEY = 'bs_clube_user_bets';

function getStoredBolao(): BolaoDetails {
  try {
    const data = localStorage.getItem(BOLAO_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading bolao details from localStorage:', error);
  }
  localStorage.setItem(BOLAO_STORAGE_KEY, JSON.stringify(initialBolaoDetails));
  return { ...initialBolaoDetails };
}

function saveStoredBolao(bolao: BolaoDetails): void {
  try {
    localStorage.setItem(BOLAO_STORAGE_KEY, JSON.stringify(bolao));
  } catch (error) {
    console.error('Error saving bolao details to localStorage:', error);
  }
}

function getStoredBets(): UserBet[] {
  try {
    const data = localStorage.getItem(BETS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading user bets from localStorage:', error);
  }
  localStorage.setItem(BETS_STORAGE_KEY, JSON.stringify(initialUserBets));
  return [...initialUserBets];
}

function saveStoredBets(bets: UserBet[]): void {
  try {
    localStorage.setItem(BETS_STORAGE_KEY, JSON.stringify(bets));
  } catch (error) {
    console.error('Error saving user bets to localStorage:', error);
  }
}

export const betsService = {
  async getBolaoDetails(_id?: string): Promise<BolaoDetails> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredBolao());
      }, 500);
    });
  },

  async updateBolaoDetails(patch: Partial<BolaoDetails>): Promise<BolaoDetails> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = getStoredBolao();
        const updated = { ...current, ...patch };
        saveStoredBolao(updated);
        resolve(updated);
      }, 500);
    });
  },

  async getAll(): Promise<UserBet[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredBets());
      }, 500);
    });
  },

  async getById(id: string): Promise<UserBet | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bets = getStoredBets();
        const found = bets.find((b) => b.id === id) || null;
        resolve(found);
      }, 500);
    });
  },

  async create(betData: Omit<UserBet, 'id' | 'createdAt'>): Promise<UserBet> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bets = getStoredBets();
        const newBet: UserBet = {
          ...betData,
          id: `bet-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          createdAt: 'Agora mesmo',
        };
        const updated = [newBet, ...bets];
        saveStoredBets(updated);

        // Update bolão vagas
        const bolao = getStoredBolao();
        saveStoredBolao({
          ...bolao,
          vagasPreenchidas: Math.min(bolao.vagasTotal, bolao.vagasPreenchidas + 1),
        });

        resolve(newBet);
      }, 500);
    });
  },

  async createBulk(bolaoId: string, numberSets: number[][], cotaPrice: number): Promise<UserBet[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bets = getStoredBets();
        const newBets: UserBet[] = numberSets.map((numbers, idx) => ({
          id: `bet-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
          bolaoId,
          numbers: [...numbers].sort((a, b) => a - b),
          createdAt: 'Agora mesmo',
          cotaPrice,
        }));

        const updated = [...newBets, ...bets];
        saveStoredBets(updated);

        // Update bolão vagas
        const bolao = getStoredBolao();
        saveStoredBolao({
          ...bolao,
          vagasPreenchidas: Math.min(bolao.vagasTotal, bolao.vagasPreenchidas + numberSets.length),
        });

        resolve(newBets);
      }, 500);
    });
  },

  async delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bets = getStoredBets();
        const filtered = bets.filter((b) => b.id !== id);
        saveStoredBets(filtered);
        resolve(true);
      }, 500);
    });
  },
};
