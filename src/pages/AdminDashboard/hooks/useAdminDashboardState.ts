import { useEffect, useState, useMemo } from 'react';
import {
  useAdminMetrics,
  useAdminWithdrawals,
  useApproveWithdrawal,
  useRejectWithdrawal,
  useAdminUsers,
  useToggleUserStatus,
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useRegisterOfficialResult,
} from '../../../hooks/useAdmin';
import { AdminCategory, AdminCategoryInput, AdminWithdrawal, RegisterResultInput } from '../../../types';

export function useAdminDashboardState() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'categories'>('dashboard');
  const [withdrawalModal, setWithdrawalModal] = useState<AdminWithdrawal | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [resultCategory, setResultCategory] = useState<AdminCategory | null>(null);
  const [alertConfig, setAlertConfig] = useState<{ title: string; msg: string; icon: string } | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [userPage, setUserPage] = useState(1);

  const { data: metrics, isLoading: isMetricsLoading } = useAdminMetrics();
  const { data: withdrawals = [], isLoading: isWithdrawalsLoading } = useAdminWithdrawals();
  const { data: usersPage, isLoading: isUsersLoading } = useAdminUsers({ page: userPage, search: userSearchTerm, status: userStatusFilter });
  const users = usersPage?.items ?? [];
  const totalPages = usersPage?.totalPages ?? 1;
  const totalCount = usersPage?.totalCount ?? 0;
  const { data: categories = [], isLoading: isCategoriesLoading } = useAdminCategories();

  useEffect(() => {
    if (userPage > totalPages) setUserPage(totalPages);
  }, [totalPages, userPage]);

  const approveWithdrawalMutation = useApproveWithdrawal();
  const rejectWithdrawalMutation = useRejectWithdrawal();
  const toggleUserStatusMutation = useToggleUserStatus();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const registerResultMutation = useRegisterOfficialResult();
  const filteredUsers = users;

  const handleUserSearchChange = (term: string) => { setUserSearchTerm(term); setUserPage(1); };
  const handleUserStatusFilterChange = (status: 'all' | 'active' | 'blocked') => { setUserStatusFilter(status); setUserPage(1); };
  const pendingWithdrawals = useMemo(() => withdrawals.filter((w) => w.status === 'pending'), [withdrawals]);

  const handleApproveWithdrawal = async (id: string) => {
    if (!withdrawalModal) return;
    try {
      await approveWithdrawalMutation.mutateAsync(id);
      setAlertConfig({ title: 'Saque Aprovado', msg: `O saque de R$ ${withdrawalModal.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para ${withdrawalModal.user} foi confirmado e enviado via Pix.`, icon: 'fa-check-double text-emerald-400' });
      setWithdrawalModal(null);
    } catch (err: any) {
      setAlertConfig({ title: 'Erro no Processamento', msg: err?.message || 'Falha ao aprovar saque.', icon: 'fa-triangle-exclamation text-rose-400' });
    }
  };

  const handleRejectWithdrawal = async (id: string) => {
    if (!withdrawalModal) return;
    try {
      await rejectWithdrawalMutation.mutateAsync(id);
      setAlertConfig({ title: 'Saque Rejeitado', msg: `A solicitação de saque de ${withdrawalModal.user} foi cancelada.`, icon: 'fa-ban text-rose-400' });
      setWithdrawalModal(null);
    } catch (err: any) {
      setAlertConfig({ title: 'Erro', msg: err?.message || 'Falha ao rejeitar saque.', icon: 'fa-triangle-exclamation text-rose-400' });
    }
  };

  const handleToggleUser = async (id: number | string) => {
    try { await toggleUserStatusMutation.mutateAsync(id); } catch (err: any) { console.error('Erro ao alterar status:', err); }
  };

  const handleCreateCategory = async (data: AdminCategoryInput) => {
    try {
      await createCategoryMutation.mutateAsync(data);
      setIsCategoryModalOpen(false);
      setAlertConfig({ title: 'Bolão Salvo', msg: `O bolão "${data.name}" foi adicionado à vitrine com sucesso.`, icon: 'fa-check text-emerald-400' });
    } catch (err: any) {
      setAlertConfig({ title: 'Erro', msg: err?.message || 'Falha ao salvar bolão.', icon: 'fa-triangle-exclamation text-rose-400' });
    }
  };

  const handleUpdateCategory = async (data: AdminCategoryInput) => {
    if (!editingCategory) return;
    try {
      await updateCategoryMutation.mutateAsync({ id: editingCategory.id, data });
      setEditingCategory(null);
      setIsCategoryModalOpen(false);
      setAlertConfig({ title: 'Bolão Atualizado', msg: `O bolão "${data.name}" foi atualizado.`, icon: 'fa-check text-emerald-400' });
    } catch (err: any) {
      setAlertConfig({ title: 'Erro', msg: err?.message || 'Falha ao atualizar bolão.', icon: 'fa-triangle-exclamation text-rose-400' });
    }
  };

  const handleRegisterResult = async (data: RegisterResultInput) => {
    try {
      await registerResultMutation.mutateAsync(data);
      setResultCategory(null);
      setAlertConfig({ title: 'Resultado Publicado', msg: 'O bolão foi encerrado e o resultado oficial está disponível.', icon: 'fa-trophy text-amber-400' });
    } catch (err: any) {
      setAlertConfig({ title: 'Erro no Resultado', msg: err?.message || 'Falha ao registrar resultado.', icon: 'fa-triangle-exclamation text-rose-400' });
    }
  };

  return {
    isSidebarOpen, setIsSidebarOpen, isSidebarCollapsed, setIsSidebarCollapsed, activeView, setActiveView,
    withdrawalModal, setWithdrawalModal, isCategoryModalOpen, setIsCategoryModalOpen, editingCategory, setEditingCategory,
    resultCategory, setResultCategory, alertConfig, setAlertConfig, userSearchTerm, setUserSearchTerm: handleUserSearchChange,
    userStatusFilter, setUserStatusFilter: handleUserStatusFilterChange, page: userPage, totalPages, totalCount, setPage: setUserPage,
    metrics, isMetricsLoading, withdrawals, pendingWithdrawals, isWithdrawalsLoading, users, filteredUsers, isUsersLoading,
    categories, isCategoriesLoading, isProcessingWithdrawal: approveWithdrawalMutation.isPending || rejectWithdrawalMutation.isPending,
    isCreatingCategory: createCategoryMutation.isPending || updateCategoryMutation.isPending,
    isRegisteringResult: registerResultMutation.isPending,
    handleApproveWithdrawal, handleRejectWithdrawal, handleToggleUser, handleCreateCategory, handleUpdateCategory, handleRegisterResult,
  };
}
