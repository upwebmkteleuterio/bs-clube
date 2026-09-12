import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  subscribedGames: string[];
  userNickname: string;
  setUserNickname: (nickname: string) => void;
  toggleSubscribeGame: (gameId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      subscribedGames: [],
      userNickname: 'Apostador',
      setUserNickname: (userNickname) => set({ userNickname }),
      toggleSubscribeGame: (gameId) => set((state) => ({
        subscribedGames: state.subscribedGames.includes(gameId)
          ? state.subscribedGames.filter((id) => id !== gameId)
          : [...state.subscribedGames, gameId],
      })),
    }),
    { name: 'bs-clube-preferences' },
  ),
);
