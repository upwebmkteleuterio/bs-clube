import { OfficialDraw } from '../types';
import { mockDraws } from '../mocks/draws';

const STORAGE_KEY = 'bs_clube_draws';

function getStoredDraws(): OfficialDraw[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading draws from localStorage:', error);
  }
  // Initialize with mocks if not present
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockDraws));
  return [...mockDraws];
}

function saveStoredDraws(draws: OfficialDraw[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draws));
  } catch (error) {
    console.error('Error saving draws to localStorage:', error);
  }
}

export const drawsService = {
  async getAll(): Promise<OfficialDraw[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredDraws());
      }, 500);
    });
  },

  async getById(id: string): Promise<OfficialDraw | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const draws = getStoredDraws();
        const found = draws.find((d) => d.id === id) || null;
        resolve(found);
      }, 500);
    });
  },

  async getLatest(): Promise<OfficialDraw | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const draws = getStoredDraws();
        resolve(draws.length > 0 ? draws[0] : null);
      }, 500);
    });
  },

  async create(drawData: Omit<OfficialDraw, 'id'>): Promise<OfficialDraw> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const draws = getStoredDraws();
        const newDraw: OfficialDraw = {
          ...drawData,
          id: `draw-${Date.now()}`,
        };
        const updated = [newDraw, ...draws];
        saveStoredDraws(updated);
        resolve(newDraw);
      }, 500);
    });
  },

  async update(id: string, updates: Partial<OfficialDraw>): Promise<OfficialDraw> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const draws = getStoredDraws();
        const index = draws.findIndex((d) => d.id === id);
        if (index === -1) {
          reject(new Error(`Sorteio com ID ${id} não encontrado.`));
          return;
        }
        const updatedDraw = { ...draws[index], ...updates };
        draws[index] = updatedDraw;
        saveStoredDraws(draws);
        resolve(updatedDraw);
      }, 500);
    });
  },

  async delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const draws = getStoredDraws();
        const filtered = draws.filter((d) => d.id !== id);
        saveStoredDraws(filtered);
        resolve(true);
      }, 500);
    });
  },
};
