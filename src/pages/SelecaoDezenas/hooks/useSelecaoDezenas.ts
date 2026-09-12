import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../../contexts/AuthContext';
import { useBolaoDetails, usePlaceBets } from '../../../hooks/useBets';
import { useWalletBalance } from '../../../hooks/useWallet';
import { SavedBetItem } from '../components/SavedGamesList';

export function useSelecaoDezenas() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { data: bolao, isLoading: isBolaoLoading } = useBolaoDetails();
  const { data: walletBalance } = useWalletBalance();
  const placeBetsMutation = usePlaceBets();

  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [savedGames, setSavedGames] = useState<SavedBetItem[]>([]);
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const unitPrice = bolao?.cotaPrice ?? 10;

  const toggleNumber = (num: number) => {
    setSelectedNumbers((prev) => {
      const index = prev.indexOf(num);
      if (index > -1) return prev.filter((n) => n !== num);
      return prev.length < 6 ? [...prev, num].sort((a, b) => a - b) : prev;
    });
  };

  const clearCurrentSelection = () => setSelectedNumbers([]);

  const generateSingleRandomNumbers = (): number[] => {
    const numbers: number[] = [];
    while (numbers.length < 6) {
      const r = Math.floor(Math.random() * (bolao?.totalLotteryNumbers || 60)) + 1;
      if (!numbers.includes(r)) numbers.push(r);
    }
    return numbers.sort((a, b) => a - b);
  };

  const generateSurpresinha = () => setSelectedNumbers(generateSingleRandomNumbers());

  const addSurpresinhasBulk = (count: number) => {
    const newGames: SavedBetItem[] = [];
    for (let i = 0; i < count; i++) {
      newGames.push({ id: `surpresinha-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`, numbers: generateSingleRandomNumbers() });
    }
    setSavedGames((prev) => [...prev, ...newGames]);
  };

  const handleAddCurrentGame = () => {
    if (selectedNumbers.length !== 6) return;
    setSavedGames((prev) => [...prev, { id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, numbers: [...selectedNumbers] }]);
    setSelectedNumbers([]);
  };

  const handleRemoveGame = (id: string) => setSavedGames((prev) => prev.filter((g) => g.id !== id));
  const handleClearAllGames = () => {
    setSavedGames([]);
    setSelectedNumbers([]);
  };

  const allFinalGames: SavedBetItem[] = [...savedGames, ...(selectedNumbers.length === 6 ? [{ id: 'current-game', numbers: selectedNumbers }] : [])];
  const totalGamesCount = allFinalGames.length;
  const totalPrice = totalGamesCount * unitPrice;
  const effectiveBalance = walletBalance?.total ?? 0;

  const handleConfirm = () => {
    if (totalGamesCount === 0) return;
    if (!session) {
      navigate('/login', { state: { from: '/selecao-dezenas' } });
      return;
    }
    setIsPaymentSheetOpen(true);
  };

  const processBalancePayment = () => {
    if (effectiveBalance < totalPrice) {
      alert('Saldo insuficiente para pagar todas as cotas.');
      return;
    }
    placeBetsMutation.mutate(
      { bolaoId: bolao?.id || 'bolao-big-10', numberSets: allFinalGames.map((g) => g.numbers), cotaPrice: unitPrice },
      {
        onSuccess: () => {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          setIsPaymentSheetOpen(false);
          handleClearAllGames();
          setToastMessage(`Apostas confirmadas com sucesso! ${totalGamesCount} cota(s) registrada(s).`);
          setTimeout(() => navigate('/resultados'), 1200);
        },
        onError: (err: any) => alert(err?.message || 'Erro ao processar as apostas.'),
      }
    );
  };

  return {
    bolao,
    isBolaoLoading,
    isLoggedIn: Boolean(session),
    balanceTotal: effectiveBalance,
    selectedNumbers,
    savedGames,
    allFinalGames,
    totalGamesCount,
    totalPrice,
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
    processBalancePayment,
    handlePayWithPix: () => navigate('/carteira'),
    isProcessingPayment: placeBetsMutation.isPending,
  };
}
