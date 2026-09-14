import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { quotaService } from '@/services/quotaService';
import { QuotaInput } from '@/types';

export const QUOTAS_QUERY_KEY = ['quotas'];

export function useActiveQuotas() {
  return useQuery({ queryKey: [...QUOTAS_QUERY_KEY, 'active'], queryFn: quotaService.getActive, staleTime: 1000 * 60 * 5 });
}

export function useAdminQuotas() {
  const { user, role } = useAuth();
  return useQuery({ queryKey: [...QUOTAS_QUERY_KEY, 'admin'], queryFn: quotaService.getAll, enabled: Boolean(user) && role === 'admin' });
}

export function useCreateQuota() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: quotaService.create, onSuccess: () => queryClient.invalidateQueries({ queryKey: QUOTAS_QUERY_KEY }) });
}

export function useUpdateQuota() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: QuotaInput }) => quotaService.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUOTAS_QUERY_KEY }),
  });
}

export function useSetQuotaActive() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => quotaService.setActive(id, isActive), onSuccess: () => queryClient.invalidateQueries({ queryKey: QUOTAS_QUERY_KEY }) });
}

export function useDeleteQuota() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: quotaService.remove, onSuccess: () => queryClient.invalidateQueries({ queryKey: QUOTAS_QUERY_KEY }) });
}
