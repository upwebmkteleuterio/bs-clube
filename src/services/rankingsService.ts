import { RankingParticipant } from '../types';
import { mockParticipants } from '../mocks/rankings';

const STORAGE_KEY = 'bs_clube_participants';

function getStoredParticipants(): RankingParticipant[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading participants from localStorage:', error);
  }
  // Initialize with mocks if not present
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockParticipants));
  return [...mockParticipants];
}

function saveStoredParticipants(participants: RankingParticipant[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
  } catch (error) {
    console.error('Error saving participants to localStorage:', error);
  }
}

export const rankingsService = {
  async getAll(gameId?: string): Promise<RankingParticipant[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const all = getStoredParticipants();
        if (gameId) {
          const filtered = all.filter((p) => p.gameId === gameId);
          // If no participant found for this gameId yet, fallback to all or empty
          resolve(filtered.length > 0 ? filtered : all.filter(p => p.gameId === 'bolao-bronze'));
        } else {
          resolve(all);
        }
      }, 500);
    });
  },

  async getById(id: string | number): Promise<RankingParticipant | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const all = getStoredParticipants();
        const found = all.find((p) => String(p.id) === String(id)) || null;
        resolve(found);
      }, 500);
    });
  },

  async create(participantData: Omit<RankingParticipant, 'id'>): Promise<RankingParticipant> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const all = getStoredParticipants();
        const newParticipant: RankingParticipant = {
          ...participantData,
          id: Date.now(),
        };
        const updated = [newParticipant, ...all];
        saveStoredParticipants(updated);
        resolve(newParticipant);
      }, 500);
    });
  },

  async update(id: string | number, updates: Partial<RankingParticipant>): Promise<RankingParticipant> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const all = getStoredParticipants();
        const index = all.findIndex((p) => String(p.id) === String(id));
        if (index === -1) {
          reject(new Error(`Participante com ID ${id} não encontrado.`));
          return;
        }
        const updated = { ...all[index], ...updates };
        all[index] = updated;
        saveStoredParticipants(all);
        resolve(updated);
      }, 500);
    });
  },

  async delete(id: string | number): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const all = getStoredParticipants();
        const filtered = all.filter((p) => String(p.id) !== String(id));
        saveStoredParticipants(filtered);
        resolve(true);
      }, 500);
    });
  },
};
