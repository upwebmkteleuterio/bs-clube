import {
  AdminWithdrawal,
  AdminUser,
  AdminCategory,
  AdminFinancialMetrics,
  ManualDrawInput,
} from '../types';
import {
  initialAdminWithdrawals,
  initialAdminUsers,
  initialAdminCategories,
  initialAdminMetrics,
} from '../mocks/admin';

const WITHDRAWALS_KEY = 'bs_clube_admin_withdrawals';
const USERS_KEY = 'bs_clube_admin_users';
const CATEGORIES_KEY = 'bs_clube_admin_categories';
const METRICS_KEY = 'bs_clube_admin_metrics';

// Helpers for localStorage
function getStoredWithdrawals(): AdminWithdrawal[] {
  try {
    const raw = localStorage.getItem(WITHDRAWALS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading admin withdrawals:', err);
  }
  localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(initialAdminWithdrawals));
  return [...initialAdminWithdrawals];
}

function saveStoredWithdrawals(data: AdminWithdrawal[]) {
  try {
    localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving admin withdrawals:', err);
  }
}

function getStoredUsers(): AdminUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading admin users:', err);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(initialAdminUsers));
  return [...initialAdminUsers];
}

function saveStoredUsers(data: AdminUser[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving admin users:', err);
  }
}

function getStoredCategories(): AdminCategory[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading admin categories:', err);
  }
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(initialAdminCategories));
  return [...initialAdminCategories];
}

function saveStoredCategories(data: AdminCategory[]) {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving admin categories:', err);
  }
}

function getStoredMetrics(): AdminFinancialMetrics {
  try {
    const raw = localStorage.getItem(METRICS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading admin metrics:', err);
  }
  localStorage.setItem(METRICS_KEY, JSON.stringify(initialAdminMetrics));
  return { ...initialAdminMetrics };
}

function saveStoredMetrics(data: AdminFinancialMetrics) {
  try {
    localStorage.setItem(METRICS_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving admin metrics:', err);
  }
}

export const adminService = {
  // Metrics
  async getMetrics(): Promise<AdminFinancialMetrics> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredMetrics());
      }, 500);
    });
  },

  // Withdrawals
  async getWithdrawals(): Promise<AdminWithdrawal[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredWithdrawals());
      }, 500);
    });
  },

  async approveWithdrawal(id: string): Promise<AdminWithdrawal> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const list = getStoredWithdrawals();
        const index = list.findIndex((w) => w.id === id);
        if (index === -1) {
          reject(new Error('Solicitação de saque não encontrada.'));
          return;
        }
        list[index] = { ...list[index], status: 'approved' };
        saveStoredWithdrawals(list);

        // Update metrics: increase premiosPagos
        const metrics = getStoredMetrics();
        const updatedMetrics = {
          ...metrics,
          premiosPagos: metrics.premiosPagos + list[index].amount,
        };
        saveStoredMetrics(updatedMetrics);

        resolve(list[index]);
      }, 500);
    });
  },

  async rejectWithdrawal(id: string): Promise<AdminWithdrawal> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const list = getStoredWithdrawals();
        const index = list.findIndex((w) => w.id === id);
        if (index === -1) {
          reject(new Error('Solicitação de saque não encontrada.'));
          return;
        }
        list[index] = { ...list[index], status: 'rejected' };
        saveStoredWithdrawals(list);
        resolve(list[index]);
      }, 500);
    });
  },

  async addWithdrawalRequest(item: {
    user: string;
    amount: number;
    pixKey: string;
    pixType: string;
  }): Promise<AdminWithdrawal> {
    const list = getStoredWithdrawals();
    const newWithdrawal: AdminWithdrawal = {
      id: `SQ-${Math.floor(1000 + Math.random() * 9000)}`,
      user: item.user,
      amount: item.amount,
      date: new Date().toLocaleString('pt-BR'),
      pixKey: item.pixKey,
      pixType: item.pixType,
      status: 'pending',
    };
    saveStoredWithdrawals([newWithdrawal, ...list]);
    return newWithdrawal;
  },

  // Users (Apostadores)
  async getUsers(): Promise<AdminUser[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredUsers());
      }, 500);
    });
  },

  async toggleUserStatus(id: number): Promise<AdminUser> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getStoredUsers();
        const index = users.findIndex((u) => u.id === id);
        if (index === -1) {
          reject(new Error('Usuário não encontrado.'));
          return;
        }
        users[index] = { ...users[index], active: !users[index].active };
        saveStoredUsers(users);
        resolve(users[index]);
      }, 500);
    });
  },

  // Categories (Bolões)
  async getCategories(): Promise<AdminCategory[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredCategories());
      }, 500);
    });
  },

  async createCategory(data: {
    name: string;
    cota: number;
    vagas: number;
    drawDate: string;
  }): Promise<AdminCategory> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = getStoredCategories();
        const newCategory: AdminCategory = {
          id: Date.now(),
          name: data.name,
          cota: data.cota,
          vagas: data.vagas,
          filled: 0,
          drawDate: data.drawDate,
          status: 'em_andamento',
        };
        saveStoredCategories([...categories, newCategory]);
        resolve(newCategory);
      }, 500);
    });
  },

  async updateCategory(
    id: number | string,
    data: Partial<AdminCategory>
  ): Promise<AdminCategory> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const categories = getStoredCategories();
        const index = categories.findIndex((c) => String(c.id) === String(id));
        if (index === -1) {
          reject(new Error('Categoria não encontrada.'));
          return;
        }
        categories[index] = { ...categories[index], ...data };
        saveStoredCategories(categories);
        resolve(categories[index]);
      }, 500);
    });
  },

  // Manual Draw Execution
  async executeManualDraw(
    input: ManualDrawInput
  ): Promise<{ message: string; drawnNumbers: number[] }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update any running category status if applicable
        const categories = getStoredCategories();
        const updated = categories.map((cat) => {
          if (cat.status === 'em_andamento') {
            return { ...cat, status: 'concluido' as const };
          }
          return cat;
        });
        saveStoredCategories(updated);

        // Update financial metrics
        const metrics = getStoredMetrics();
        saveStoredMetrics({
          ...metrics,
          totalArrecadado: metrics.totalArrecadado + 12500,
          premiosPagos: metrics.premiosPagos + 9750,
        });

        resolve({
          message: `Concurso #${input.concurso} apurado com sucesso. Prêmios distribuídos automaticamente.`,
          drawnNumbers: input.dezenas,
        });
      }, 600);
    });
  },
};
