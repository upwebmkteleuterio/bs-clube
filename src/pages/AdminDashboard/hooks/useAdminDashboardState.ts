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
  useExecuteManualDraw,
} from '../../../hooks/useAdmin';
import { AdminCategoryInput, AdminWithdrawal, ManualDrawInput } from '../../../types';

export function useAdminDashboardState() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'categories'>('dashboard');

  // Modals
  const [withdrawalModal, setWithdrawalModal] = useState<AdminWithdrawal | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isManualDrawModalOpen, setIsManualDrawModalOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{ title: string; msg: string; icon: string } | null>(null);

  // Search & Filter
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [userPage, setUserPage] = useState(1);

  // Queries
  const { data: metrics, isLoading: isMetricsLoading } = useAdminMetrics();
  const { data: withdrawals = [], isLoading: isWithdrawalsLoading } = useAdminWithdrawals();
  const { data: usersPage, isLoading: isUsersLoading } = useAdminUsers({
    page: userPage,
    search: userSearchTerm,
    status: userStatusFilter,
  });
  const users = usersPage?.items ?? [];
  const totalPages = usersPage?.totalPages ?? 1;
  const totalCount = usersPage?.totalCount ?? 0;
  const { data: categories = [], isLoading: isCategoriesLoading } = useAdminCategories();

  useEffect(() => {
    if (userPage > totalPages) setUserPage(totalPages);
  }, [totalPages, userPage]);

  // Mutations
  const approveWithdrawalMutation = useApproveWithdrawal();
  const rejectWithdrawalMutation = useRejectWithdrawal();
  const toggleUserStatusMutation = useToggleUserStatus();
  const createCategoryMutation = useCreateCategory();
  const executeManualDrawMutation = useExecuteManualDraw();

  const filteredUsers = users;

  const handleUserSearchChange = (term: string) => {
    setUserSearchTerm(term);
    setUserPage(1);
  };

  const handleUserStatusFilterChange = (status: 'all' | 'active' | 'blocked') => {
    setUserStatusFilter(status);
    setUserPage(1);
  };

  const pendingWithdrawals = useMemo(() => {
    return withdrawals.filter((w) => w.status === 'pending');
  }, [withdrawals]);

  // Actions
  const handleApproveWithdrawal = async (id: string) => {
    if (!withdrawalModal) return;
    try {
      await approveWithdrawalMutation.mutateAsync(id);
      setAlertConfig({
        title: 'Saque Aprovado',
        msg: `O saque de R$ ${withdrawalModal.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para ${withdrawalModal.user} foi confirmado e enviado via Pix.`,
        icon: 'fa-check-double text-emerald-400',
      });
      setWithdrawalModal(null);
    } catch (err: any) {
      setAlertConfig({
        title: 'Erro no Processamento',
        msg: err?.message || 'Falha ao aprovar saque.',
        icon: 'fa-triangle-exclamation text-rose-400',
      });
    }
  };

  const handleRejectWithdrawal = async (id: string) => {
    if (!withdrawalModal) return;
    try {
      await rejectWithdrawalMutation.mutateAsync(id);
      setAlertConfig({
        title: 'Saque Rejeitado',
        msg: `A solicitação de saque de ${withdrawalModal.user} foi cancelada.`,
        icon: 'fa-ban text-rose-400',
      });
      setWithdrawalModal(null);
    } catch (err: any) {
      setAlertConfig({
        title: 'Erro',
        msg: err?.message || 'Falha ao rejeitar saque.',
        icon: 'fa-triangle-exclamation text-rose-400',
      });
    }
  };

  const handleToggleUser = async (id: number | string) => {
    try {
      await toggleUserStatusMutation.mutateAsync(id);
    } catch (err: any) {
      console.error('Erro ao alterar status:', err);
    }
  };

  const handleCreateCategory = async (data: AdminCategoryInput) => {
    try {
      await createCategoryMutation.mutateAsync(data);
      setIsCategoryModalOpen(false);
      setAlertConfig({
        title: 'Categoria Salva',
        msg: `A categoria "${data.name}" foi adicionada à vitrine com sucesso.`,
        icon: 'fa-check text-emerald-400',
      });
    } catch (err: any) {
      setAlertConfig({
        title: 'Erro',
        msg: err?.message || 'Falha ao salvar categoria.',
        icon: 'fa-triangle-exclamation text-rose-400',
      });
    }
  };

  const handleExecuteDraw = async (drawData: ManualDrawInput) => {
    try {
      const result = await executeManualDrawMutation.mutateAsync(drawData);
      setIsManualDrawModalOpen(false);
      setAlertConfig({
        title: 'Apuração Concluída',
        msg: result.message || 'Os resultados foram injetados e os prêmios calculados.',
        icon: 'fa-trophy text-amber-400',
      });
    } catch (err: any) {
      setAlertConfig({
        title: 'Erro na Apuração',
        msg: err?.message || 'Falha ao executar apuração manual.',
        icon: 'fa-triangle-exclamation text-rose-400',
      });
    }
  };

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    activeView,
    setActiveView,
    withdrawalModal,
    setWithdrawalModal,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    isManualDrawModalOpen,
    setIsManualDrawModalOpen,
    alertConfig,
    setAlertConfig,
    userSearchTerm,
    setUserSearchTerm: handleUserSearchChange,
    userStatusFilter,
    setUserStatusFilter: handleUserStatusFilterChange,
    page: userPage,
    totalPages,
    totalCount,
    setPage: setUserPage,
    metrics,
    isMetricsLoading,
    withdrawals,
    pendingWithdrawals,
    isWithdrawalsLoading,
    users,
    filteredUsers,
    isUsersLoading,
    categories,
    isCategoriesLoading,
    isProcessingWithdrawal:
      approveWithdrawalMutation.isPending || rejectWithdrawalMutation.isPending,
    isCreatingCategory: createCategoryMutation.isPending,
    isExecutingDraw: executeManualDrawMutation.isPending,
    handleApproveWithdrawal,
    handleRejectWithdrawal,
    handleToggleUser,
    handleCreateCategory,
    handleExecuteDraw,
  };
}
