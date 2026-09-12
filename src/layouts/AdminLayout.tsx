import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminProvider, useAdmin } from '../pages/AdminDashboard/context/AdminContext';
import AdminSidebar from '../pages/AdminDashboard/components/AdminSidebar';
import AdminHeader from '../pages/AdminDashboard/components/AdminHeader';
import WithdrawalAnalysisModal from '../pages/AdminDashboard/components/WithdrawalAnalysisModal';
import NewCategoryModal from '../pages/AdminDashboard/components/NewCategoryModal';
import ManualDrawModal from '../pages/AdminDashboard/components/ManualDrawModal';
import AdminFeedbackModal from '../pages/AdminDashboard/components/AdminFeedbackModal';
import PrototypeMenu from '../components/PrototypeMenu';

function AdminLayoutInner() {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    withdrawalModal,
    setWithdrawalModal,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    isManualDrawModalOpen,
    setIsManualDrawModalOpen,
    alertConfig,
    setAlertConfig,
    pendingWithdrawals,
    isProcessingWithdrawal,
    isCreatingCategory,
    isExecutingDraw,
    handleApproveWithdrawal,
    handleRejectWithdrawal,
    handleCreateCategory,
    handleExecuteDraw,
  } = useAdmin();

  return (
    <div className="flex h-screen overflow-hidden bg-brand-dark text-slate-50 font-sans">
      {/* Sidebar Global de Navegação Administrativa */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenManualDraw={() => setIsManualDrawModalOpen(true)}
      />

      {/* Área Principal de Conteúdo */}
      <main className="flex-1 flex flex-col h-screen relative overflow-hidden bg-brand-dark">
        <AdminHeader
          onToggleSidebar={() => setIsSidebarOpen(true)}
          pendingCount={pendingWithdrawals.length}
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {/* Renderização das sub-páginas administrativas via Outlet */}
          <Outlet />
        </div>
      </main>

      {/* Modais Administrativos Globais */}
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

      <PrototypeMenu />
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AdminProvider>
      <AdminLayoutInner />
    </AdminProvider>
  );
}
