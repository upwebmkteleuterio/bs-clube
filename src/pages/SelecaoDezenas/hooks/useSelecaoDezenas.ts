import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../../contexts/AuthContext';
import { useGames } from '../../../hooks/useGames';
import { useBolaoDetails, usePlaceBets } from '../../../hooks/useBets';
import { useWalletBalance } from '../../../hooks/useWallet';
import { SavedBetItem } from '../components/SavedGamesList';

export function useSelecaoDezenas() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const routerState = location.state as { bolaoId?: string } | null;
  const requestedPoolId = routerState?.bolaoId;
  const { data: pools = [], isLoading: isPoolsLoading } = useGames();
  const [selectedPoolId, setSelectedPoolId] = useState<string | undefined>(requestedPoolId);
  const activePoolId = useMemo(() => {
    if (selectedPoolId && pools.some((pool) => pool.id === selectedPoolId)) return selectedPoolId;
    if (requestedPoolId && pools.some((pool) => pool.id === requestedPoolId)) return requestedPoolId;
    return pools[0]?.id;
  }, [pools, requestedPoolId, selectedPoolId]);
  const { data: bolao, isLoading: isBolaoLoading } = useBolaoDetails(activePoolId);
  const { data: walletBalance } = useWalletBalance();
  const placeBetsMutation = usePlaceBets();

  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [savedGames, setSavedGames] = useState<SavedBetItem[]>([]);
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [confirmAfterAuth, setConfirmAfterAuth] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (activePoolId && activePoolId !== selectedPoolId) setSelectedPoolId(activePoolId);
  }, [activePoolId, selectedPoolId]);

  useEffect(() => {
    if (session && confirmAfterAuth) {
      setConfirmAfterAuth(false);
      setIsAuthModalOpen(false);
      setIsPaymentSheetOpen(true);
    }
  }, [confirmAfterAuth, session]);

  const unitPrice = bolao?.cotaPrice ?? 0;
  const numberLimit = bolao?.maxNumbers ?? 6;

  const toggleNumber = (num: number) => {
    setSelectedNumbers((prev) => {
      const index = prev.indexOf(num);
      if (index > -1) return prev.filter((n) => n !== num);
      return prev.length < numberLimit ? [...prev, num].sort((a, b) => a - b) : prev;
    });
  };

  const clearCurrentSelection = () => setSelectedNumbers([]);

  const generateSingleRandomNumbers = (): number[] => {
    const numbers: number[] = [];
    while (numbers.length < numberLimit) {
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
    if (selectedNumbers.length !== numberLimit) return;
    setSavedGames((prev) => [...prev, { id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, numbers: [...selectedNumbers] }]);
    setSelectedNumbers([]);
  };

  const handleRemoveGame = (id: string) => setSavedGames((prev) => prev.filter((g) => g.id !== id));
  const handleClearAllGames = () => {
    setSavedGames([]);
    setSelectedNumbers([]);
  };

  const allFinalGames: SavedBetItem[] = [...savedGames, ...(selectedNumbers.length === numberLimit ? [{ id: 'current-game', numbers: selectedNumbers }] : [])];
  const totalGamesCount = allFinalGames.length;
  const totalPrice = totalGamesCount * unitPrice;
  const effectiveBalance = walletBalance?.total ?? 0;

  const handlePoolChange = (poolId: string) => {
    if (pools.some((pool) => pool.id === poolId)) setSelectedPoolId(poolId);
  };

  const handleConfirm = () => {
    if (totalGamesCount === 0 || !bolao) return;
    if (!session) {
      setConfirmAfterAuth(true);
      setIsAuthModalOpen(true);
      return;
    }
    setIsPaymentSheetOpen(true);
  };

  const processBalancePayment = () => {
    if (!bolao) return;
    if (effectiveBalance < totalPrice) {
      alert('Saldo insuficiente para pagar todas as cotas.');
      return;
    }
    placeBetsMutation.mutate(
      { bolaoId: bolao.id, numberSets: allFinalGames.map((g) => g.numbers), cotaPrice: unitPrice },
      {
        onSuccess: () => {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          setIsPaymentSheetOpen(false);
          handleClearAllGames();
          setToastMessage(`Apostas confirmadas com sucesso! ${totalGamesCount} cota(s) registrada(s).`);
          setTimeout(() => navigate('/resultados'), 1200);
        },
        onError: (err: any) => alert(err?.message || 'Erro ao processar as apostas.'),
      },
    );
  };

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setConfirmAfterAuth(false);
  }, []);

  return {
    bolao,
    pools,
    isBolaoLoading: isPoolsLoading || isBolaoLoading,
    isPoolsLoading,
    isLoggedIn: Boolean(session),
    balanceTotal: effectiveBalance,
    selectedNumbers,
    savedGames,
    allFinalGames,
    totalGamesCount,
    totalPrice,
    isPaymentSheetOpen,
    setIsPaymentSheetOpen,
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
    handlePayWithPix: () => navigate('/carteira'),
    isProcessingPayment: placeBetsMutation.isPending,
    numberLimit,
  };
}
