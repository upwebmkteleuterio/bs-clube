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
  usePrizeSettings,
  useUpdatePrizeSettings,
} from '../../../hooks/useAdmin';
import { AdminCategory, AdminCategoryInput, AdminCategoryStatus, AdminWithdrawal, PrizeSettings, RegisterResultInput } from '../../../types';

export function useAdminDashboardState() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'categories'>('dashboard');
  const [withdrawalModal, setWithdrawalModal] = useState<AdminWithdrawal | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isPrizeSettingsModalOpen, setIsPrizeSettingsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [resultCategory, setResultCategory] = useState<AdminCategory | null>(null);
  const [alertConfig, setAlertConfig] = useState<{ title: string; msg: string; icon: string } | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [userPage, setUserPage] = useState(1);
  const [categoryStatusFilter, setCategoryStatusFilter] = useState<AdminCategoryStatus>('open');
  const [categoryMonthFilter, setCategoryMonthFilter] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [categoryPage, setCategoryPage] = useState(1);

  const { data: metrics, isLoading: isMetricsLoading } = useAdminMetrics();
  const { data: withdrawals = [], isLoading: isWithdrawalsLoading } = useAdminWithdrawals();
  const { data: usersPage, isLoading: isUsersLoading } = useAdminUsers({ page: userPage, search: userSearchTerm, status: userStatusFilter });
  const users = usersPage?.items ?? [];
  const totalPages = usersPage?.totalPages ?? 1;
  const totalCount = usersPage?.totalCount ?? 0;
  const { data: categoriesPage, isLoading: isCategoriesLoading } = useAdminCategories({ page: categoryPage, status: categoryStatusFilter, month: categoryMonthFilter });
  const { data: prizeSettings } = usePrizeSettings();
  const categories = categoriesPage?.items ?? [];
  const categoryTotalPages = categoriesPage?.totalPages ?? 1;
  const categoryTotalCount = categoriesPage?.totalCount ?? 0;

  useEffect(() => {
    if (userPage > totalPages) setUserPage(totalPages);
  }, [totalPages, userPage]);

  useEffect(() => {
    if (categoryPage > categoryTotalPages) setCategoryPage(categoryTotalPages);
  }, [categoryPage, categoryTotalPages]);

  const approveWithdrawalMutation = useApproveWithdrawal();
  const rejectWithdrawalMutation = useRejectWithdrawal();
  const toggleUserStatusMutation = useToggleUserStatus();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const registerResultMutation = useRegisterOfficialResult();
  const updatePrizeSettingsMutation = useUpdatePrizeSettings();
  const filteredUsers = users;

  const handleUserSearchChange = (term: string) => { setUserSearchTerm(term); setUserPage(1); };
  const handleUserStatusFilterChange = (status: 'all' | 'active' | 'blocked') => { setUserStatusFilter(status); setUserPage(1); };
  const handleCategoryStatusFilterChange = (status: AdminCategoryStatus) => { setCategoryStatusFilter(status); setCategoryPage(1); };
  const handleCategoryMonthFilterChange = (month: string) => { setCategoryMonthFilter(month); setCategoryPage(1); };
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

  const handleUpdatePrizeSettings = async (settings: PrizeSettings) => {
    try {
      await updatePrizeSettingsMutation.mutateAsync(settings);
      setIsPrizeSettingsModalOpen(false);
      setAlertConfig({ title: 'Configuração Salva', msg: 'O padrão de rateio foi atualizado para novos bolões.', icon: 'fa-check text-emerald-400' });
    } catch (err: any) {
      setAlertConfig({ title: 'Erro', msg: err?.message || 'Falha ao salvar configuração.', icon: 'fa-triangle-exclamation text-rose-400' });
    }
  };

  const handleRegisterResult = async (data: RegisterResultInput) => {
    try {
      const outcome = await registerResultMutation.mutateAsync(data);
      setResultCategory(null);
      setAlertConfig({ title: 'Resultado Publicado', msg: `${outcome.winnerCount} ganhador(es) · R$ ${outcome.winners.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} distribuídos. O bolão foi encerrado.`, icon: 'fa-trophy text-amber-400' });
    } catch (err: any) {
      setAlertConfig({ title: 'Erro no Resultado', msg: err?.message || 'Falha ao registrar resultado.', icon: 'fa-triangle-exclamation text-rose-400' });
    }
  };

  return {
    isSidebarOpen, setIsSidebarOpen, isSidebarCollapsed, setIsSidebarCollapsed, activeView, setActiveView,
    withdrawalModal, setWithdrawalModal, isCategoryModalOpen, setIsCategoryModalOpen, isPrizeSettingsModalOpen, setIsPrizeSettingsModalOpen, editingCategory, setEditingCategory,
    resultCategory, setResultCategory, alertConfig, setAlertConfig, prizeSettings, userSearchTerm, setUserSearchTerm: handleUserSearchChange,
    userStatusFilter, setUserStatusFilter: handleUserStatusFilterChange, page: userPage, totalPages, totalCount, setPage: setUserPage,
    categoryStatusFilter, setCategoryStatusFilter: handleCategoryStatusFilterChange, categoryMonthFilter, setCategoryMonthFilter: handleCategoryMonthFilterChange, categoryPage, categoryTotalPages, categoryTotalCount, setCategoryPage,
    metrics, isMetricsLoading, withdrawals, pendingWithdrawals, isWithdrawalsLoading, users, filteredUsers, isUsersLoading,
    categories, isCategoriesLoading, isProcessingWithdrawal: approveWithdrawalMutation.isPending || rejectWithdrawalMutation.isPending,
    isCreatingCategory: createCategoryMutation.isPending || updateCategoryMutation.isPending,
    isUpdatingPrizeSettings: updatePrizeSettingsMutation.isPending,
    isRegisteringResult: registerResultMutation.isPending,
    handleApproveWithdrawal, handleRejectWithdrawal, handleToggleUser, handleCreateCategory, handleUpdateCategory, handleUpdatePrizeSettings, handleRegisterResult,
  };
}
