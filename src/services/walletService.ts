import { UserTransaction, WalletBalance } from '../types';
import { initialWalletBalance, initialTransactions } from '../mocks/wallet';
import { adminService } from './adminService';

const BALANCE_STORAGE_KEY = 'bs_clube_wallet_balance';
const TRANSACTIONS_STORAGE_KEY = 'bs_clube_transactions';

function getStoredBalance(): WalletBalance {
  try {
    const data = localStorage.getItem(BALANCE_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading wallet balance from localStorage:', error);
  }
  localStorage.setItem(BALANCE_STORAGE_KEY, JSON.stringify(initialWalletBalance));
  return { ...initialWalletBalance };
}

function saveStoredBalance(balance: WalletBalance): void {
  try {
    localStorage.setItem(BALANCE_STORAGE_KEY, JSON.stringify(balance));
  } catch (error) {
    console.error('Error saving wallet balance to localStorage:', error);
  }
}

function getStoredTransactions(): UserTransaction[] {
  try {
    const data = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading transactions from localStorage:', error);
  }
  localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(initialTransactions));
  return [...initialTransactions];
}

function saveStoredTransactions(transactions: UserTransaction[]): void {
  try {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions to localStorage:', error);
  }
}

export const walletService = {
  async getBalance(): Promise<WalletBalance> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredBalance());
      }, 500);
    });
  },

  async updateBalance(newBalance: Partial<WalletBalance>): Promise<WalletBalance> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = getStoredBalance();
        const updated = { ...current, ...newBalance };
        saveStoredBalance(updated);
        resolve(updated);
      }, 500);
    });
  },

  async getAll(): Promise<UserTransaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredTransactions());
      }, 500);
    });
  },

  async getById(id: string): Promise<UserTransaction | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const txs = getStoredTransactions();
        const found = txs.find((t) => t.id === id) || null;
        resolve(found);
      }, 500);
    });
  },

  async createDeposit(amount: number): Promise<{ balance: WalletBalance; transaction: UserTransaction }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentBalance = getStoredBalance();
        const newBalance: WalletBalance = {
          ...currentBalance,
          total: currentBalance.total + amount,
          withdrawable: currentBalance.withdrawable + amount,
        };
        saveStoredBalance(newBalance);

        const newTx: UserTransaction = {
          id: `TRX-PIX${Math.floor(1000 + Math.random() * 9000)}`,
          type: 'deposit',
          title: 'Depósito Pix',
          date: 'Agora mesmo',
          value: amount,
          status: 'success',
        };

        const txs = getStoredTransactions();
        saveStoredTransactions([newTx, ...txs]);

        resolve({ balance: newBalance, transaction: newTx });
      }, 500);
    });
  },

  async createWithdrawal(
    amount: number,
    pixKeyType: string,
    pixKey: string
  ): Promise<{ balance: WalletBalance; transaction: UserTransaction }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const currentBalance = getStoredBalance();
        if (amount > currentBalance.withdrawable) {
          reject(new Error('Saldo sacável insuficiente'));
          return;
        }

        const newBalance: WalletBalance = {
          ...currentBalance,
          total: currentBalance.total - amount,
          withdrawable: currentBalance.withdrawable - amount,
        };
        saveStoredBalance(newBalance);

        const newTx: UserTransaction = {
          id: `TRX-WD${Math.floor(1000 + Math.random() * 9000)}`,
          type: 'withdraw',
          title: 'Saque Solicitado',
          date: 'Agora mesmo',
          value: -amount,
          status: 'success',
          pixKeyType,
          pixKey,
        };

        const txs = getStoredTransactions();
        saveStoredTransactions([newTx, ...txs]);

        // Sync withdrawal request to admin panel
        adminService.addWithdrawalRequest({
          user: 'Você (Apostador Atual)',
          amount,
          pixKey,
          pixType: pixKeyType,
        }).catch((err) => console.error('Error syncing to admin:', err));

        resolve({ balance: newBalance, transaction: newTx });
      }, 500);
    });
  },

  async delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const txs = getStoredTransactions();
        const filtered = txs.filter((t) => t.id !== id);
        saveStoredTransactions(filtered);
        resolve(true);
      }, 500);
    });
  },
};
