import React from 'react';
import AuthModal from '../components/AuthModal';
import { useSelecaoDezenas } from './SelecaoDezenas/hooks/useSelecaoDezenas';
import BolaoInfoCard from './SelecaoDezenas/components/BolaoInfoCard';
import NumberGrid from './SelecaoDezenas/components/NumberGrid';
import SavedGamesList from './SelecaoDezenas/components/SavedGamesList';
import BottomConfirmationBar from './SelecaoDezenas/components/BottomConfirmationBar';
import PaymentModal from './SelecaoDezenas/components/PaymentModal';
import DepositModal from './Carteira/components/DepositModal';
import PixPaymentSheet from './Carteira/components/PixPaymentSheet';

export default function SelecaoDezenas() {
  const {
    bolao,
    pools,
    isBolaoLoading,
    isPoolsLoading,
    balanceTotal,
    selectedNumbers,
    savedGames,
    allFinalGames,
    totalGamesCount,
    totalPrice,
    isPaymentSheetOpen,
    setIsPaymentSheetOpen,
    isDepositModalOpen,
    setIsDepositModalOpen,
    isPixSheetOpen,
    setIsPixSheetOpen,
    depositAmount,
    setDepositAmount,
    pixTimer,
    pixCode,
    generatePixPayment,
    isAuthModalOpen,
    closeAuthModal,
    toastMessage,
    setToastMessage,
    toggleNumber,
    clearCurrentSelection,
    generateSurpresinha,
    addSurpresinhasBulk,
    handleAddCurrentGame,
    handleRemoveGame,
    handleClearAllGames,
    handlePoolChange,
    handleConfirm,
    processBalancePayment,
    handlePayWithPix,
    isProcessingPayment,
    numberLimit,
  } = useSelecaoDezenas();

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl flex items-center space-x-2 animate-bounce">
          <i className="fa-solid fa-circle-check"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-52 space-y-6">
        {/* Card de informações do bolão, carregado a partir do banco de dados */}
        <BolaoInfoCard
          bolao={bolao}
          pools={pools}
          isLoading={isBolaoLoading}
          isPoolsLoading={isPoolsLoading}
          onPoolChange={handlePoolChange}
        />

        {/* Grade de Seleção de Números (1 a 60) */}
        <NumberGrid
          selectedNumbers={selectedNumbers}
          onToggleNumber={toggleNumber}
          onGenerateSurpresinha={generateSurpresinha}
          onAddSurpresinhasBulk={addSurpresinhasBulk}
          onClearCurrentSelection={clearCurrentSelection}
          onAddCurrentGame={handleAddCurrentGame}
          totalBalls={bolao?.totalLotteryNumbers || 60}
          requiredNumbers={numberLimit}
        />

        {/* Lista de Múltiplos Jogos Salvos na Mesma Tela */}
        <SavedGamesList
          savedGames={savedGames}
          onRemoveGame={handleRemoveGame}
          onClearAllGames={handleClearAllGames}
        />
      </main>

      {/* Barra de Confirmação Fixa no Rodapé com Soma Dinâmica */}
      <BottomConfirmationBar
        totalGamesCount={totalGamesCount}
        totalPrice={totalPrice}
        selectedNumbersCount={selectedNumbers.length}
        savedGamesCount={savedGames.length}
        requiredNumbers={numberLimit}
        bolaoTitle={bolao?.nome ?? 'Bolão indisponível'}
        onClearAll={handleClearAllGames}
        onConfirm={handleConfirm}
      />


      {/* Sheet / Modal de Pagamento de Cotas */}
      <PaymentModal
        isOpen={isPaymentSheetOpen}
        onClose={() => setIsPaymentSheetOpen(false)}
        bolaoName={bolao?.nome ?? 'Bolão indisponível'}
        totalGamesCount={totalGamesCount}
        totalPrice={totalPrice}
        allGames={allFinalGames}
        userBalance={balanceTotal}
        onPayWithBalance={processBalancePayment}
        onPayWithPix={handlePayWithPix}
        isProcessing={isProcessingPayment}
      />

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        depositAmount={depositAmount}
        onDepositAmountChange={setDepositAmount}
        onQuickAdd={(value) => setDepositAmount(((Number.parseFloat(depositAmount) || 0) + value).toFixed(2))}
        onGeneratePix={generatePixPayment}
      />

      <PixPaymentSheet
        isOpen={isPixSheetOpen}
        onClose={() => setIsPixSheetOpen(false)}
        depositAmount={depositAmount}
        pixTimer={pixTimer}
        pixCode={pixCode}
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
}
