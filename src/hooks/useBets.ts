import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { betsService } from '../services/betsService';
import { walletService } from '../services/walletService';
import { useAppStore } from '../store/useAppStore';
import { WALLET_BALANCE_KEY, TRANSACTIONS_KEY } from './useWallet';

export const BOLAO_DETAILS_KEY = ['bolao', 'details'];
export const USER_BETS_KEY = ['bets', 'user'];

export function useBolaoDetails(id?: string) {
  return useQuery({
    queryKey: [...BOLAO_DETAILS_KEY, id || 'default'],
    queryFn: () => betsService.getBolaoDetails(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserBets() {
  return useQuery({
    queryKey: USER_BETS_KEY,
    queryFn: () => betsService.getAll(),
    staleTime: 1000 * 60,
  });
}

export function usePlaceBets() {
  const queryClient = useQueryClient();
  const { addWithdrawal, addTransaction } = useAppStore();

  return useMutation({
    mutationFn: async ({
      bolaoId,
      bolaoName,
      numberSets,
      cotaPrice,
    }: {
      bolaoId: string;
      bolaoName: string;
      numberSets: number[][];
      cotaPrice: number;
    }) => {
      const totalAmount = numberSets.length * cotaPrice;

      // Deduct balance in wallet service
      const currentBalance = await walletService.getBalance();
      if (currentBalance.total < totalAmount) {
        throw new Error('Saldo insuficiente para registrar as apostas.');
      }

      await walletService.updateBalance({
        total: currentBalance.total - totalAmount,
        withdrawable: Math.max(0, currentBalance.withdrawable - totalAmount),
      });

      // Create bets
      const createdBets = await betsService.createBulk(bolaoId, numberSets, cotaPrice);

      // Create transaction log
      const tx = {
        id: `TRX-BET${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'bet' as const,
        title: `Aposta ${bolaoName} (${numberSets.length} cota${numberSets.length > 1 ? 's' : ''})`,
        date: 'Agora mesmo',
        value: -totalAmount,
        status: 'success',
      };

      return { createdBets, tx, totalAmount };
    },
    onSuccess: ({ tx, totalAmount }) => {
      queryClient.invalidateQueries({ queryKey: BOLAO_DETAILS_KEY });
      queryClient.invalidateQueries({ queryKey: USER_BETS_KEY });
      queryClient.invalidateQueries({ queryKey: WALLET_BALANCE_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });

      // Synchronize Zustand app store
      addWithdrawal(totalAmount);
      addTransaction(tx);
    },
  });
}
