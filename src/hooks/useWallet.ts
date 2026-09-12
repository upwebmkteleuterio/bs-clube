import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { walletService } from '../services/walletService';

export const WALLET_BALANCE_KEY = ['wallet', 'balance'];
export const TRANSACTIONS_KEY = ['wallet', 'transactions'];

export function useWalletBalance() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...WALLET_BALANCE_KEY, user?.id ?? 'guest'],
    queryFn: () => walletService.getBalance(),
    enabled: Boolean(user),
    staleTime: 1000 * 60,
  });
}

export function useWalletTransactions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...TRANSACTIONS_KEY, user?.id ?? 'guest'],
    queryFn: () => walletService.getAll(),
    enabled: Boolean(user),
    staleTime: 1000 * 60,
  });
}

export function useDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => walletService.createDeposit(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_BALANCE_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
    },
  });
}

export function useWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ amount, pixKeyType, pixKey }: { amount: number; pixKeyType: string; pixKey: string }) =>
      walletService.createWithdrawal(amount, pixKeyType, pixKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_BALANCE_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
    },
  });
}
