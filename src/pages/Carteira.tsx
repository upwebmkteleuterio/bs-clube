import React from 'react';
import { useCarteiraState } from './Carteira/hooks/useCarteiraState';
import BalanceCard from './Carteira/components/BalanceCard';
import TransactionHistory from './Carteira/components/TransactionHistory';
import DepositModal from './Carteira/components/DepositModal';
import PixPaymentSheet from './Carteira/components/PixPaymentSheet';
import WithdrawModal from './Carteira/components/WithdrawModal';
import ReceiptSheet from './Carteira/components/ReceiptSheet';
export default function Carteira() {
  const {
    balance,
    isBalanceLoading,
    transactions,
    isTransactionsLoading,
    transactionTotalCount,
    transactionPage,
    transactionPageSize,
    setTransactionPage,
    isBalanceVisible,
    setIsBalanceVisible,
    isDepositModalOpen,
    setIsDepositModalOpen,
    isPixSheetOpen,
    setIsPixSheetOpen,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    isReceiptSheetOpen,
    setIsReceiptSheetOpen,
    receiptTx,
    depositAmount,
    setDepositAmount,
    withdrawAmount,
    setWithdrawAmount,
    withdrawKeyType,
    setWithdrawKeyType,
    withdrawKey,
    setWithdrawKey,
    pixTimer,
    handleDepositInput,
    addDepositQuick,
    generatePixPayment,
    createPaymentIntent,
    setWithdrawMax,
    processWithdraw,
    openTransactionReceipt,
    isProcessingWithdraw,
  } = useCarteiraState();

  return (
    <div className="min-h-screen flex flex-col pb-28">
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="space-y-6">
          <BalanceCard
            balance={balance}
            isLoading={isBalanceLoading}
            isBalanceVisible={isBalanceVisible}
            onToggleBalanceVisibility={() => setIsBalanceVisible(!isBalanceVisible)}
            onOpenDeposit={() => {
              setDepositAmount('');
              setIsDepositModalOpen(true);
            }}
            onOpenWithdraw={() => {
              setWithdrawAmount('');
              setWithdrawKey('');
              setIsWithdrawModalOpen(true);
            }}
          />

          <TransactionHistory
            transactions={transactions}
            totalCount={transactionTotalCount}
            page={transactionPage}
            pageSize={transactionPageSize}
            onPageChange={setTransactionPage}
            isLoading={isTransactionsLoading}
            onSelectTransaction={openTransactionReceipt}
          />
        </div>
      </main>

      {/* Modals & Bottom Sheets */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        depositAmount={depositAmount}
        onDepositAmountChange={handleDepositInput}
        onQuickAdd={addDepositQuick}
        onGeneratePix={generatePixPayment}
      />

      <PixPaymentSheet
        isOpen={isPixSheetOpen}
        onClose={() => setIsPixSheetOpen(false)}
        depositAmount={depositAmount}
        pixTimer={pixTimer}
        onCreatePaymentIntent={createPaymentIntent}
      />

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        balanceWithdrawable={balance?.withdrawable ?? 0}
        withdrawAmount={withdrawAmount}
        onWithdrawAmountChange={setWithdrawAmount}
        withdrawKeyType={withdrawKeyType}
        onWithdrawKeyTypeChange={setWithdrawKeyType}
        withdrawKey={withdrawKey}
        onWithdrawKeyChange={setWithdrawKey}
        onSetMax={setWithdrawMax}
        onProcessWithdraw={processWithdraw}
        isProcessing={isProcessingWithdraw}
      />

      <ReceiptSheet
        isOpen={isReceiptSheetOpen}
        onClose={() => setIsReceiptSheetOpen(false)}
        transaction={receiptTx}
      />
    </div>
  );
}
