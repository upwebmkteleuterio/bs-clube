import { create } from 'zustand';

interface SavedGameDraft {
  id: string;
  numbers: number[];
}

interface BetSelectionState {
  selectedPoolId?: string;
  selectedNumbers: number[];
  savedGames: SavedGameDraft[];
  pendingPixAmount: number | null;
  isPixPending: boolean;
  setSelectedPoolId: (poolId?: string) => void;
  setSelectedNumbers: (numbers: number[]) => void;
  setSavedGames: (games: SavedGameDraft[]) => void;
  setPendingPix: (amount: number | null, pending: boolean) => void;
  clearSelection: () => void;
}

export const useBetSelectionStore = create<BetSelectionState>((set) => ({
  selectedPoolId: undefined,
  selectedNumbers: [],
  savedGames: [],
  pendingPixAmount: null,
  isPixPending: false,
  setSelectedPoolId: (selectedPoolId) => set({ selectedPoolId }),
  setSelectedNumbers: (selectedNumbers) => set({ selectedNumbers }),
  setSavedGames: (savedGames) => set({ savedGames }),
  setPendingPix: (pendingPixAmount, isPixPending) => set({ pendingPixAmount, isPixPending }),
  clearSelection: () => set({ selectedPoolId: undefined, selectedNumbers: [], savedGames: [], pendingPixAmount: null, isPixPending: false }),
}));
