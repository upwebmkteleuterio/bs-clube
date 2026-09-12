import React from 'react';
import { useCarteiraState } from './Carteira/hooks/useCarteiraState';
import CarteiraHeader from './Carteira/components/CarteiraHeader';
import BalanceCard from './Carteira/components/BalanceCard';
import TransactionHistory from './Carteira/components/TransactionHistory';
import DepositModal from './Carteira/components/DepositModal';
import PixPaymentSheet from './Carteira/components/PixPaymentSheet';
import WithdrawModal from './Carteira/components/WithdrawModal';
import ReceiptSheet from './Carteira/components/ReceiptSheet';
import GuestRestrictedCard from './Carteira/components/GuestRestrictedCard';

export default function Carteira() {
  const {
    authMode,
    simulateLogin,
    balance,
    isBalanceLoading,
    transactions,
    isTransactionsLoading,
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
    simulatePixWebhookSuccess,
    setWithdrawMax,
    processWithdraw,
    openTransactionReceipt,
    isProcessingWithdraw,
  } = useCarteiraState();

  return (
    <div className="min-h-screen flex flex-col pb-28">
      {/* Clean Header without prototype/visitor mode bar */}
      <CarteiraHeader />

      <main className="max-w-4xl w-full mx-auto px-4 pt-6 space-y-6">
        {authMode === 'guest' ? (
          <GuestRestrictedCard onSimulateLogin={simulateLogin} />
        ) : (
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
              isLoading={isTransactionsLoading}
              onSelectTransaction={openTransactionReceipt}
            />
          </div>
        )}
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
        onSimulateWebhook={simulatePixWebhookSuccess}
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
