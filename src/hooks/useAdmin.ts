import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/adminService';
import { RESULTS_GAMES_QUERY_KEY } from './useGames';
import { RANKINGS_QUERY_KEY } from './useRankings';
import { WALLET_BALANCE_KEY } from './useWallet';
import { PRIZE_AWARDS_QUERY_KEY } from './usePrizeAwards';
import { AdminCategoryInput, AdminCategoryStatus, AdminUserStatus, PrizeSettings, RegisterResultInput } from '../types';

export const ADMIN_METRICS_KEY = ['admin', 'metrics'];
export const ADMIN_WITHDRAWALS_KEY = ['admin', 'withdrawals'];
export const ADMIN_USERS_KEY = ['admin', 'users'];
export const ADMIN_CATEGORIES_KEY = ['admin', 'categories'];
export const ADMIN_PRIZE_SETTINGS_KEY = ['admin', 'prize-settings'];

export function usePrizeSettings() {
  const { user, role } = useAuth();
  return useQuery({
    queryKey: ADMIN_PRIZE_SETTINGS_KEY,
    queryFn: () => adminService.getPrizeSettings(),
    enabled: Boolean(user) && role === 'admin',
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdatePrizeSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: PrizeSettings) => adminService.updatePrizeSettings(settings),
    onSuccess: (settings) => {
      queryClient.setQueryData(ADMIN_PRIZE_SETTINGS_KEY, settings);
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY });
    },
  });
}

export function useAdminMetrics() {
  const { user, role } = useAuth();
  return useQuery({
    queryKey: ADMIN_METRICS_KEY,
    queryFn: () => adminService.getMetrics(),
    enabled: Boolean(user) && role === 'admin',
    staleTime: 1000 * 30,
  });
}

export function useAdminWithdrawals() {
  const { user, role } = useAuth();
  return useQuery({
    queryKey: ADMIN_WITHDRAWALS_KEY,
    queryFn: () => adminService.getWithdrawals(),
    enabled: Boolean(user) && role === 'admin',
    staleTime: 1000 * 30,
  });
}

export function useApproveWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.approveWithdrawal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_WITHDRAWALS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_METRICS_KEY });
    },
  });
}

export function useRejectWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.rejectWithdrawal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_WITHDRAWALS_KEY });
    },
  });
}

export function useAdminUsers({
  page,
  search,
  status,
}: {
  page: number;
  search: string;
  status: AdminUserStatus;
}) {
  const { user, role } = useAuth();
  const pageSize = 10;
  return useQuery({
    queryKey: [...ADMIN_USERS_KEY, { page, search, status }],
    queryFn: () => adminService.getUsers({ page, pageSize, search, status }),
    enabled: Boolean(user) && role === 'admin',
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30,
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => adminService.toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_METRICS_KEY });
    },
  });
}

export function useAdminCategories({ page, status }: { page: number; status: AdminCategoryStatus }) {
  const { user, role } = useAuth();
  const pageSize = 10;
  return useQuery({
    queryKey: [...ADMIN_CATEGORIES_KEY, { page, status }],
    queryFn: () => adminService.getCategories({ page, pageSize, status }),
    enabled: Boolean(user) && role === 'admin',
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminCategoryInput) => adminService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY });
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: RESULTS_GAMES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['draws'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: AdminCategoryInput }) =>
      adminService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY });
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: RESULTS_GAMES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['draws'] });
    },
  });
}

export function useRegisterOfficialResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterResultInput) => adminService.registerOfficialResult(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_METRICS_KEY });
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: RESULTS_GAMES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['draws'] });
      queryClient.invalidateQueries({ queryKey: RANKINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WALLET_BALANCE_KEY });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] });
      queryClient.invalidateQueries({ queryKey: PRIZE_AWARDS_QUERY_KEY });
    },
  });
}
