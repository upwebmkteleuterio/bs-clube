import { Game } from '../types';
import { mockGames } from '../mocks/games';

const STORAGE_KEY = 'bs_clube_games';

function getStoredGames(): Game[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading games from localStorage:', error);
  }
  // Initialize with mocks if not present
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockGames));
  return [...mockGames];
}

function saveStoredGames(games: Game[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch (error) {
    console.error('Error saving games to localStorage:', error);
  }
}

export const gamesService = {
  async getAll(): Promise<Game[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredGames());
      }, 500);
    });
  },

  async getById(id: string): Promise<Game | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const games = getStoredGames();
        const found = games.find((g) => g.id === id) || null;
        resolve(found);
      }, 500);
    });
  },

  async create(gameData: Omit<Game, 'id'>): Promise<Game> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const games = getStoredGames();
        const newGame: Game = {
          ...gameData,
          id: `game-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        const updated = [newGame, ...games];
        saveStoredGames(updated);
        resolve(newGame);
      }, 500);
    });
  },

  async update(id: string, updates: Partial<Game>): Promise<Game> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const games = getStoredGames();
        const index = games.findIndex((g) => g.id === id);
        if (index === -1) {
          reject(new Error(`Bolão com ID ${id} não encontrado.`));
          return;
        }
        const updatedGame = { ...games[index], ...updates };
        games[index] = updatedGame;
        saveStoredGames(games);
        resolve(updatedGame);
      }, 500);
    });
  },

  async delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const games = getStoredGames();
        const filtered = games.filter((g) => g.id !== id);
        saveStoredGames(filtered);
        resolve(true);
      }, 500);
    });
  },
};
