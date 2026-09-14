import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { betsService } from '../services/betsService';
import { useAuth } from '../contexts/AuthContext';
import { WALLET_BALANCE_KEY, TRANSACTIONS_KEY } from './useWallet';
import { GAMES_QUERY_KEY } from './useGames';
import { RANKINGS_QUERY_KEY } from './useRankings';

export const BOLAO_DETAILS_KEY = ['bolao', 'details'];
export const USER_BETS_KEY = ['bets', 'user'];

export function useBolaoDetails(id?: string) {
  return useQuery({
    queryKey: [...BOLAO_DETAILS_KEY, id || 'default'],
    queryFn: () => betsService.getBolaoDetails(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserBets() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...USER_BETS_KEY, user?.id ?? 'guest'],
    queryFn: () => betsService.getAll(),
    enabled: Boolean(user),
    staleTime: 1000 * 60,
  });
}

export function usePlaceBets() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bolaoId, numberSets, cotaPrice }: { bolaoId: string; numberSets: number[][]; cotaPrice: number }) =>
      betsService.placeBets(bolaoId, numberSets, cotaPrice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOLAO_DETAILS_KEY });
      queryClient.invalidateQueries({ queryKey: USER_BETS_KEY });
      queryClient.invalidateQueries({ queryKey: WALLET_BALANCE_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: GAMES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: RANKINGS_QUERY_KEY });
    },
  });
}
