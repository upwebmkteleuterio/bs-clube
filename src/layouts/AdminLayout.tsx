import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminProvider, useAdmin } from '../pages/AdminDashboard/context/AdminContext';
import AdminSidebar from '../pages/AdminDashboard/components/AdminSidebar';
import AdminHeader from '../pages/AdminDashboard/components/AdminHeader';
import WithdrawalAnalysisModal from '../pages/AdminDashboard/components/WithdrawalAnalysisModal';
import NewCategoryModal from '../pages/AdminDashboard/components/NewCategoryModal';
import RegisterResultModal from '../pages/AdminDashboard/components/RegisterResultModal';
import AdminResultDetailModal from '../pages/AdminDashboard/components/AdminResultDetailModal';
import AdminFeedbackModal from '../pages/AdminDashboard/components/AdminFeedbackModal';
import PrizeSettingsModal from '../pages/AdminDashboard/components/PrizeSettingsModal';

function AdminLayoutInner() {
  const {
    isSidebarOpen, setIsSidebarOpen, isSidebarCollapsed, setIsSidebarCollapsed,
    withdrawalModal, setWithdrawalModal, isCategoryModalOpen, setIsCategoryModalOpen,
    isPrizeSettingsModalOpen, setIsPrizeSettingsModalOpen, editingCategory, setEditingCategory, resultCategory, setResultCategory,
    readOnlyResultCategory, setReadOnlyResultCategory, resultDetails, isResultDetailsLoading, resultDetailsError,
    alertConfig, setAlertConfig, prizeSettings, pendingWithdrawals, isProcessingWithdrawal,
    isCreatingCategory, isUpdatingPrizeSettings, isRegisteringResult, handleApproveWithdrawal, handleRejectWithdrawal,
    handleCreateCategory, handleUpdateCategory, handleUpdatePrizeSettings, handleRegisterResult,
  } = useAdmin();

  const categoryModalSubmit = editingCategory ? handleUpdateCategory : handleCreateCategory;

  return (
    <div className="flex h-screen overflow-hidden bg-brand-dark text-slate-50 font-sans">
      <AdminSidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col h-screen relative overflow-hidden bg-brand-dark">
        <AdminHeader
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          pendingCount={pendingWithdrawals.length}
        />
        <div className="flex-1 overflow-y-auto p-4 sm:p-8"><Outlet /></div>
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
        onClose={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}
        onSubmit={categoryModalSubmit}
        isSubmitting={isCreatingCategory}
      />
      <RegisterResultModal
        isOpen={Boolean(resultCategory)}
        category={resultCategory}
        onClose={() => setResultCategory(null)}
        onSubmit={handleRegisterResult}
        isSubmitting={isRegisteringResult}
      />
      <AdminResultDetailModal
        isOpen={Boolean(readOnlyResultCategory)}
        category={readOnlyResultCategory}
        result={resultDetails}
        isLoading={isResultDetailsLoading}
        error={resultDetailsError}
        onClose={() => setReadOnlyResultCategory(null)}
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

export default function AdminLayout() {
  return <AdminProvider><AdminLayoutInner /></AdminProvider>;
}
