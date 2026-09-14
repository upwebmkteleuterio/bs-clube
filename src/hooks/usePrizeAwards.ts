import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { prizeAwardsService } from '../services/prizeAwardsService';

export const PRIZE_AWARDS_QUERY_KEY = ['prize-awards'];

export function useOwnPrizeAwards(poolId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...PRIZE_AWARDS_QUERY_KEY, user?.id ?? 'guest', poolId ?? 'none'],
    queryFn: () => (poolId ? prizeAwardsService.getOwnByPool(poolId) : []),
    enabled: Boolean(user && poolId),
    staleTime: 1000 * 60,
  });
}
