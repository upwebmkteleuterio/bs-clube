import { useQuery } from '@tanstack/react-query';
import { rankingsService } from '../services/rankingsService';

export const RANKINGS_QUERY_KEY = ['rankings'];

export function useRankings(gameId?: string, drawId?: string) {
  return useQuery({
    queryKey: [...RANKINGS_QUERY_KEY, gameId || 'all', drawId || 'all'],
    queryFn: () => rankingsService.getAll(gameId, drawId),
    enabled: Boolean(gameId && drawId),
    staleTime: 1000 * 60 * 2,
  });
}
