import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamesService } from '../services/gamesService';
import { Game } from '../types';

export const GAMES_QUERY_KEY = ['games'];

export function useGames() {
  return useQuery({
    queryKey: GAMES_QUERY_KEY,
    queryFn: () => gamesService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useGame(id?: string) {
  return useQuery({
    queryKey: [...GAMES_QUERY_KEY, id],
    queryFn: () => (id ? gamesService.getById(id) : null),
    enabled: Boolean(id),
  });
}

export function useUpdateGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Game> }) =>
      gamesService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GAMES_QUERY_KEY });
    },
  });
}
