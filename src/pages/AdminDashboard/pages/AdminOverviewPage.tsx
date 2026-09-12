import React from 'react';
import { useAdmin } from '../context/AdminContext';
import MetricsOverview from '../components/MetricsOverview';
import WithdrawalsTable from '../components/WithdrawalsTable';

export default function AdminOverviewPage() {
  const {
    metrics,
    isMetricsLoading,
    pendingWithdrawals,
    isWithdrawalsLoading,
    setWithdrawalModal,
  } = useAdmin();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <MetricsOverview metrics={metrics} isLoading={isMetricsLoading} />
      <WithdrawalsTable
        withdrawals={pendingWithdrawals}
        isLoading={isWithdrawalsLoading}
        onSelectWithdrawal={setWithdrawalModal}
      />
    </div>
  );
}
