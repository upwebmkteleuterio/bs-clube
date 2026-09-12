import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  subscribedGames: string[];
  toggleSubscribeGame: (gameId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      subscribedGames: [],
      toggleSubscribeGame: (gameId) => set((state) => ({
        subscribedGames: state.subscribedGames.includes(gameId)
          ? state.subscribedGames.filter((id) => id !== gameId)
          : [...state.subscribedGames, gameId],
      })),
    }),
    { name: 'bs-clube-preferences' },
  ),
);
