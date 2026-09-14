import React from 'react';
import { useAdminDashboardState } from './AdminDashboard/hooks/useAdminDashboardState';
import AdminSidebar from './AdminDashboard/components/AdminSidebar';
import AdminHeader from './AdminDashboard/components/AdminHeader';
import MetricsOverview from './AdminDashboard/components/MetricsOverview';
import WithdrawalsTable from './AdminDashboard/components/WithdrawalsTable';
import UsersManagementTable from './AdminDashboard/components/UsersManagementTable';
import CategoriesManagementTable from './AdminDashboard/components/CategoriesManagementTable';
import WithdrawalAnalysisModal from './AdminDashboard/components/WithdrawalAnalysisModal';
import NewCategoryModal from './AdminDashboard/components/NewCategoryModal';
import RegisterResultModal from './AdminDashboard/components/RegisterResultModal';
import AdminFeedbackModal from './AdminDashboard/components/AdminFeedbackModal';
import PrizeSettingsModal from './AdminDashboard/components/PrizeSettingsModal';

export default function AdminDashboard() {
  const state = useAdminDashboardState();
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    activeView,
    setActiveView,
    withdrawalModal,
    setWithdrawalModal,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    isPrizeSettingsModalOpen,
    setIsPrizeSettingsModalOpen,
    editingCategory,
    setEditingCategory,
    resultCategory,
    setResultCategory,
    alertConfig,
    setAlertConfig,
    userSearchTerm,
    setUserSearchTerm,
    userStatusFilter,
    setUserStatusFilter,
    page: userPage,
    totalPages: userTotalPages,
    totalCount: userTotalCount,
    setPage: setUserPage,
    categoryStatusFilter,
    setCategoryStatusFilter,
    categoryMonthFilter,
    setCategoryMonthFilter,
    categoryPage,
    categoryTotalPages,
    categoryTotalCount,
    setCategoryPage,
    metrics,
    isMetricsLoading,
    pendingWithdrawals,
    isWithdrawalsLoading,
    filteredUsers,
    isUsersLoading,
    categories,
    isCategoriesLoading,
    isProcessingWithdrawal,
    isCreatingCategory,
    isUpdatingPrizeSettings,
    isRegisteringResult,
    prizeSettings,
    handleApproveWithdrawal,
    handleRejectWithdrawal,
    handleToggleUser,
    handleCreateCategory,
    handleUpdateCategory,
    handleUpdatePrizeSettings,
    handleRegisterResult,
  } = state;

  const categorySubmit = editingCategory ? handleUpdateCategory : handleCreateCategory;

  return (
    <div className="flex h-screen overflow-hidden bg-brand-dark text-slate-50 font-sans">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeView={activeView}
        onSelectView={setActiveView}
      />

      <main className="flex-1 flex flex-col h-screen relative overflow-hidden bg-brand-dark">
        <AdminHeader
          activeView={activeView}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          pendingCount={pendingWithdrawals.length}
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {activeView === 'dashboard' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <MetricsOverview metrics={metrics} isLoading={isMetricsLoading} />
              <WithdrawalsTable
                withdrawals={pendingWithdrawals}
                isLoading={isWithdrawalsLoading}
                onSelectWithdrawal={setWithdrawalModal}
              />
            </div>
          )}

          {activeView === 'users' && (
            <div className="max-w-7xl mx-auto">
              <UsersManagementTable
                users={filteredUsers}
                totalCount={userTotalCount}
                page={userPage}
                totalPages={userTotalPages}
                onPageChange={setUserPage}
                isLoading={isUsersLoading}
                searchTerm={userSearchTerm}
                onSearchChange={setUserSearchTerm}
                statusFilter={userStatusFilter}
                onStatusFilterChange={setUserStatusFilter}
                onToggleUserStatus={handleToggleUser}
              />
            </div>
          )}

          {activeView === 'categories' && (
            <div className="max-w-7xl mx-auto">
              <CategoriesManagementTable
                categories={categories}
                totalCount={categoryTotalCount}
                page={categoryPage}
                totalPages={categoryTotalPages}
                statusFilter={categoryStatusFilter}
                monthFilter={categoryMonthFilter}
                onPageChange={setCategoryPage}
                onStatusFilterChange={setCategoryStatusFilter}
                onMonthFilterChange={setCategoryMonthFilter}
                isLoading={isCategoriesLoading}
                onOpenNewCategory={() => {
                  setEditingCategory(null);
                  setIsCategoryModalOpen(true);
                }}
                onOpenPrizeSettings={() => setIsPrizeSettingsModalOpen(true)}
                onEditCategory={(category) => {
                  setEditingCategory(category);
                  setIsCategoryModalOpen(true);
                }}
                onRegisterResult={setResultCategory}
              />
            </div>
          )}
        </div>
      </main>

      <WithdrawalAnalysisModal
        isOpen={Boolean(withdrawalModal)}
        withdrawal={withdrawalModal}
        onClose={() => setWithdrawalModal(null)}
        onApprove={handleApproveWithdrawal}
        onReject={handleRejectWithdrawal}
        isProcessing={isProcessingWithdrawal}
      />

      <NewCategoryModal
        isOpen={isCategoryModalOpen}
        category={editingCategory}
        prizeSettings={prizeSettings}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={categorySubmit}
        isSubmitting={isCreatingCategory}
      />

      <RegisterResultModal
        isOpen={Boolean(resultCategory)}
        category={resultCategory}
        onClose={() => setResultCategory(null)}
        onSubmit={handleRegisterResult}
        isSubmitting={isRegisteringResult}
      />

      <PrizeSettingsModal
        isOpen={isPrizeSettingsModalOpen}
        settings={prizeSettings}
        onClose={() => setIsPrizeSettingsModalOpen(false)}
        onSubmit={handleUpdatePrizeSettings}
        isSubmitting={isUpdatingPrizeSettings}
      />

      <AdminFeedbackModal config={alertConfig} onClose={() => setAlertConfig(null)} />
    </div>
  );
}
