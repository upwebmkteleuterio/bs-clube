import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { walletService } from '../services/walletService';
import { WalletTransactionFilter } from '../types';

export const WALLET_BALANCE_KEY = ['wallet', 'balance'];
export const TRANSACTIONS_KEY = ['wallet', 'transactions'];

export function useWalletBalance(options: { refetchInterval?: number | false } = {}) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...WALLET_BALANCE_KEY, user?.id ?? 'guest'],
    queryFn: () => walletService.getBalance(),
    enabled: Boolean(user),
    staleTime: 1000 * 60,
    refetchInterval: options.refetchInterval,
  });
}

export function useWalletTransactions({ pageSize = 10, filter = 'all' }: { pageSize?: number; filter?: WalletTransactionFilter } = {}) {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState(filter);
  const queryPage = activeFilter === filter ? page : 1;

  useEffect(() => {
    if (activeFilter !== filter) {
      setActiveFilter(filter);
      setPage(1);
    }
  }, [activeFilter, filter]);

  const query = useQuery({
    queryKey: [...TRANSACTIONS_KEY, user?.id ?? 'guest', filter, queryPage, pageSize],
    queryFn: () => walletService.getPage(queryPage, pageSize, filter),
    enabled: Boolean(user),
    staleTime: 1000 * 60,
  });

  return { ...query, page: queryPage, pageSize, filter, setPage };
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
