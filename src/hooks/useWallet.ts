import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletService } from '../services/walletService';
import { useAppStore } from '../store/useAppStore';

export const WALLET_BALANCE_KEY = ['wallet', 'balance'];
export const TRANSACTIONS_KEY = ['wallet', 'transactions'];

export function useWalletBalance() {
  const { addDeposit } = useAppStore();
  return useQuery({
    queryKey: WALLET_BALANCE_KEY,
    queryFn: async () => {
      const balance = await walletService.getBalance();
      return balance;
    },
    staleTime: 1000 * 60,
  });
}

export function useWalletTransactions() {
  return useQuery({
    queryKey: TRANSACTIONS_KEY,
    queryFn: () => walletService.getAll(),
    staleTime: 1000 * 60,
  });
}

export function useDeposit() {
  const queryClient = useQueryClient();
  const { addDeposit, addTransaction } = useAppStore();

  return useMutation({
    mutationFn: (amount: number) => walletService.createDeposit(amount),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: WALLET_BALANCE_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      // Keep app store in sync
      addDeposit(result.transaction.value);
      addTransaction(result.transaction);
    },
  });
}

export function useWithdrawal() {
  const queryClient = useQueryClient();
  const { addWithdrawal, addTransaction } = useAppStore();

  return useMutation({
    mutationFn: ({
      amount,
      pixKeyType,
      pixKey,
    }: {
      amount: number;
      pixKeyType: string;
      pixKey: string;
    }) => walletService.createWithdrawal(amount, pixKeyType, pixKey),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: WALLET_BALANCE_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      // Keep app store in sync
      addWithdrawal(Math.abs(result.transaction.value));
      addTransaction(result.transaction);
    },
  });
}
