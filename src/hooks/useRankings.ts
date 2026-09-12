import { useQuery } from '@tanstack/react-query';
import { rankingsService } from '../services/rankingsService';

export const RANKINGS_QUERY_KEY = ['rankings'];

export function useRankings(gameId?: string) {
  return useQuery({
    queryKey: [...RANKINGS_QUERY_KEY, gameId || 'all'],
    queryFn: () => rankingsService.getAll(gameId),
    enabled: Boolean(gameId),
    staleTime: 1000 * 60 * 2,
  });
}
