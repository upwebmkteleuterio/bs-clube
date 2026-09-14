import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/adminService';
import { AdminCategoryInput, AdminUserStatus, ManualDrawInput } from '../types';

export const ADMIN_METRICS_KEY = ['admin', 'metrics'];
export const ADMIN_WITHDRAWALS_KEY = ['admin', 'withdrawals'];
export const ADMIN_USERS_KEY = ['admin', 'users'];
export const ADMIN_CATEGORIES_KEY = ['admin', 'categories'];

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

export function useAdminCategories() {
  const { user, role } = useAuth();
  return useQuery({
    queryKey: ADMIN_CATEGORIES_KEY,
    queryFn: () => adminService.getCategories(),
    enabled: Boolean(user) && role === 'admin',
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
      queryClient.invalidateQueries({ queryKey: ['draws'] });
    },
  });
}

export function useExecuteManualDraw() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ManualDrawInput) => adminService.executeManualDraw(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_METRICS_KEY });
      queryClient.invalidateQueries({ queryKey: ['draws'] });
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
}
