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
import ManualDrawModal from './AdminDashboard/components/ManualDrawModal';
import AdminFeedbackModal from './AdminDashboard/components/AdminFeedbackModal';

export default function AdminDashboard() {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
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
    setUserSearchTerm,
    userStatusFilter,
    setUserStatusFilter,
    metrics,
    isMetricsLoading,
    pendingWithdrawals,
    isWithdrawalsLoading,
    users,
    filteredUsers,
    isUsersLoading,
    categories,
    isCategoriesLoading,
    isProcessingWithdrawal,
    isCreatingCategory,
    isExecutingDraw,
    handleApproveWithdrawal,
    handleRejectWithdrawal,
    handleToggleUser,
    handleCreateCategory,
    handleExecuteDraw,
  } = useAdminDashboardState();

  return (
    <div className="flex h-screen overflow-hidden bg-brand-dark text-slate-50 font-sans">
      {/* Sidebar Navigation */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenManualDraw={() => setIsManualDrawModalOpen(true)}
      />

      {/* Main Content Area */}
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
                totalCount={users.length}
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
                isLoading={isCategoriesLoading}
                onOpenNewCategory={() => setIsCategoryModalOpen(true)}
              />
            </div>
          )}
        </div>
      </main>

      {/* Interactive Modals */}
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
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCreateCategory}
        isSubmitting={isCreatingCategory}
      />

      <ManualDrawModal
        isOpen={isManualDrawModalOpen}
        onClose={() => setIsManualDrawModalOpen(false)}
        onSubmit={handleExecuteDraw}
        isExecuting={isExecutingDraw}
      />

      <AdminFeedbackModal
        config={alertConfig}
        onClose={() => setAlertConfig(null)}
      />
    </div>
  );
}
