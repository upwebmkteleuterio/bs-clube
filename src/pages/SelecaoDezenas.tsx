import React from 'react';
import { useSelecaoDezenas } from './SelecaoDezenas/hooks/useSelecaoDezenas';
import SelecaoHeader from './SelecaoDezenas/components/SelecaoHeader';
import BolaoInfoCard from './SelecaoDezenas/components/BolaoInfoCard';
import NumberGrid from './SelecaoDezenas/components/NumberGrid';
import SavedGamesList from './SelecaoDezenas/components/SavedGamesList';
import BottomConfirmationBar from './SelecaoDezenas/components/BottomConfirmationBar';
import GuestRegisterModal from './SelecaoDezenas/components/GuestRegisterModal';
import PaymentModal from './SelecaoDezenas/components/PaymentModal';

export default function SelecaoDezenas() {
  const {
    bolao,
    isBolaoLoading,
    authMode,
    balanceTotal,
    selectedNumbers,
    savedGames,
    allFinalGames,
    totalGamesCount,
    totalPrice,
    isGuestModalOpen,
    setIsGuestModalOpen,
    isPaymentSheetOpen,
    setIsPaymentSheetOpen,
    toastMessage,
    setToastMessage,
    toggleNumber,
    clearCurrentSelection,
    generateSurpresinha,
    addSurpresinhasBulk,
    handleAddCurrentGame,
    handleRemoveGame,
    handleClearAllGames,
    handleConfirm,
    handleGuestRegisterSuccess,
    processBalancePayment,
    handlePayWithPix,
    isProcessingPayment,
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

      {/* Header limpo sem barra de protótipo */}
      <SelecaoHeader
        lotteryTitle={bolao?.lottery || 'MEGA-SENA'}
        concursoRef={bolao?.concursoRef || 'Concurso #2780 • Caixa'}
        balanceTotal={balanceTotal}
        isLoggedIn={authMode === 'auth'}
        onOpenNotifications={() =>
          setToastMessage('Você está participando dos melhores bolões da Mega-Sena.')
        }
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-52 space-y-6">
        {/* Card Informações do Bolão (Dinâmico a partir do Mock/Banco de Dados) */}
        <BolaoInfoCard bolao={bolao} isLoading={isBolaoLoading} />

        {/* Grade de Seleção de Números (1 a 60) */}
        <NumberGrid
          selectedNumbers={selectedNumbers}
          onToggleNumber={toggleNumber}
          onGenerateSurpresinha={generateSurpresinha}
          onAddSurpresinhasBulk={addSurpresinhasBulk}
          onClearCurrentSelection={clearCurrentSelection}
          onAddCurrentGame={handleAddCurrentGame}
          totalBalls={bolao?.totalLotteryNumbers || 60}
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
        bolaoTitle={bolao?.nome || 'SORTEIO BIG 10'}
        onClearAll={handleClearAllGames}
        onConfirm={handleConfirm}
      />

      {/* Modal Criar Conta para Visitante */}
      <GuestRegisterModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        totalGamesCount={totalGamesCount}
        totalPrice={totalPrice}
        onRegisterSuccess={handleGuestRegisterSuccess}
      />

      {/* Sheet / Modal de Pagamento de Cotas */}
      <PaymentModal
        isOpen={isPaymentSheetOpen}
        onClose={() => setIsPaymentSheetOpen(false)}
        bolaoName={bolao?.nome || 'Sorteio BIG 10'}
        totalGamesCount={totalGamesCount}
        totalPrice={totalPrice}
        allGames={allFinalGames}
        userBalance={balanceTotal}
        onPayWithBalance={processBalancePayment}
        onPayWithPix={handlePayWithPix}
        isProcessing={isProcessingPayment}
      />
    </div>
  );
}
