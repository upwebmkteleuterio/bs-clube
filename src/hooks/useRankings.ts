import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rankingsService } from '../services/rankingsService';
import { RankingParticipant } from '../types';

export const RANKINGS_QUERY_KEY = ['rankings'];

export function useRankings(gameId?: string) {
  return useQuery({
    queryKey: [...RANKINGS_QUERY_KEY, gameId || 'all'],
    queryFn: () => rankingsService.getAll(gameId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useAddParticipant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<RankingParticipant, 'id'>) => rankingsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RANKINGS_QUERY_KEY });
    },
  });
}
