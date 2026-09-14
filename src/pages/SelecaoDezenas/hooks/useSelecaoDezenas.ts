import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../../contexts/AuthContext';
import { useGames } from '../../../hooks/useGames';
import { useBolaoDetails, usePlaceBets } from '../../../hooks/useBets';
import { useDeposit, useWalletBalance } from '../../../hooks/useWallet';
import { useBetSelectionStore } from '../../../store/useBetSelectionStore';
import { SavedBetItem } from '../components/SavedGamesList';

export function useSelecaoDezenas() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const requestedPoolId = (location.state as { bolaoId?: string } | null)?.bolaoId;
  const draftSelectedPoolId = useBetSelectionStore((state) => state.selectedPoolId);
  const draftSelectedNumbers = useBetSelectionStore((state) => state.selectedNumbers);
  const draftSavedGames = useBetSelectionStore((state) => state.savedGames);
  const draftPendingPixAmount = useBetSelectionStore((state) => state.pendingPixAmount);
  const draftIsPixPending = useBetSelectionStore((state) => state.isPixPending);
  const setDraftPool = useBetSelectionStore((state) => state.setSelectedPoolId);
  const setDraftNumbers = useBetSelectionStore((state) => state.setSelectedNumbers);
  const setDraftGames = useBetSelectionStore((state) => state.setSavedGames);
  const setDraftPendingPix = useBetSelectionStore((state) => state.setPendingPix);
  const clearDraft = useBetSelectionStore((state) => state.clearSelection);
  const { data: pools = [], isLoading: isPoolsLoading } = useGames();
  const [selectedPoolId, setSelectedPoolId] = useState<string | undefined>(requestedPoolId ?? draftSelectedPoolId);
  const activePoolId = useMemo(() => {
    if (selectedPoolId && pools.some((pool) => pool.id === selectedPoolId)) return selectedPoolId;
    if (requestedPoolId && pools.some((pool) => pool.id === requestedPoolId)) return requestedPoolId;
    return pools[0]?.id;
  }, [pools, requestedPoolId, selectedPoolId]);
  const { data: bolao, isLoading: isBolaoLoading } = useBolaoDetails(activePoolId);
  const [isPixPending, setIsPixPending] = useState(draftIsPixPending);
  const { data: walletBalance } = useWalletBalance({ refetchInterval: isPixPending ? 5000 : false });
  const placeBetsMutation = usePlaceBets();
  const depositMutation = useDeposit();
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>(draftSelectedNumbers);
  const [savedGames, setSavedGames] = useState<SavedBetItem[]>(draftSavedGames);
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isPixSheetOpen, setIsPixSheetOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(draftPendingPixAmount ? String(draftPendingPixAmount) : '');
  const [pixCode, setPixCode] = useState<string | undefined>();
  const [pixTimer, setPixTimer] = useState(15 * 60);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [confirmAfterAuth, setConfirmAfterAuth] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const pixBalanceStartRef = useRef<number | null>(null);
  const pixTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const draftClearedRef = useRef(false);
  const unitPrice = bolao?.cotaPrice ?? 0;
  const numberLimit = bolao?.maxNumbers ?? bolao?.minNumbers ?? 6;
  const allFinalGames: SavedBetItem[] = [...savedGames, ...(selectedNumbers.length === numberLimit ? [{ id: 'current-game', numbers: selectedNumbers }] : [])];
  const totalGamesCount = allFinalGames.length;
  const totalPrice = totalGamesCount * unitPrice;
  const effectiveBalance = walletBalance?.total ?? 0;

  useEffect(() => {
    if (activePoolId && activePoolId !== selectedPoolId) setSelectedPoolId(activePoolId);
  }, [activePoolId, selectedPoolId]);
  useEffect(() => {
    if (!draftClearedRef.current && activePoolId) setDraftPool(activePoolId);
  }, [activePoolId, setDraftPool]);
  useEffect(() => {
    if (!draftClearedRef.current) setDraftNumbers(selectedNumbers);
  }, [selectedNumbers, setDraftNumbers]);
  useEffect(() => {
    if (!draftClearedRef.current) setDraftGames(savedGames);
  }, [savedGames, setDraftGames]);
  useEffect(() => {
    if (session && confirmAfterAuth) {
      setConfirmAfterAuth(false);
      setIsAuthModalOpen(false);
      setIsPaymentSheetOpen(true);
    }
  }, [confirmAfterAuth, session]);
  useEffect(() => {
    if (!isPixPending || !walletBalance || !bolao) return;
    if (pixBalanceStartRef.current === null) {
      if (walletBalance.total >= totalPrice) {
        setIsPixPending(false);
        setDraftPendingPix(null, false);
        setIsPixSheetOpen(false);
        setIsDepositModalOpen(false);
        setIsPaymentSheetOpen(true);
        return;
      }
      pixBalanceStartRef.current = walletBalance.total;
      return;
    }
    if (walletBalance.total <= pixBalanceStartRef.current || walletBalance.total < totalPrice) return;
    setIsPixPending(false);
    setDraftPendingPix(null, false);
    setIsPixSheetOpen(false);
    setIsDepositModalOpen(false);
    setIsPaymentSheetOpen(true);
    pixBalanceStartRef.current = null;
  }, [bolao, isPixPending, setDraftPendingPix, totalPrice, walletBalance]);
  useEffect(() => () => {
    if (pixTimerRef.current) clearInterval(pixTimerRef.current);
  }, []);

  const toggleNumber = (num: number) => {
    draftClearedRef.current = false;
    setSelectedNumbers((prev) => {
      const index = prev.indexOf(num);
      if (index > -1) return prev.filter((n) => n !== num);
      return prev.length < numberLimit ? [...prev, num].sort((a, b) => a - b) : prev;
    });
  };
  const clearCurrentSelection = () => {
    draftClearedRef.current = false;
    setSelectedNumbers([]);
  };
  useEffect(() => {
    if (!isPixPending) {
      if (pixTimerRef.current) {
        clearInterval(pixTimerRef.current);
        pixTimerRef.current = null;
      }
      return;
    }
    if (pixTimer > 0 && !pixTimerRef.current) {
      pixTimerRef.current = setInterval(() => setPixTimer((previous) => Math.max(0, previous - 1)), 1000);
    }
    if (pixTimer <= 0) {
      if (pixTimerRef.current) {
        clearInterval(pixTimerRef.current);
        pixTimerRef.current = null;
      }
      setIsPixPending(false);
      setDraftPendingPix(null, false);
      setIsPixSheetOpen(false);
      pixBalanceStartRef.current = null;
    }
  }, [isPixPending, pixTimer, setDraftPendingPix]);
  const generateSingleRandomNumbers = (): number[] => {
    const numbers: number[] = [];
    while (numbers.length < numberLimit) {
      const r = Math.floor(Math.random() * (bolao?.totalLotteryNumbers || 60)) + 1;
      if (!numbers.includes(r)) numbers.push(r);
    }
    return numbers.sort((a, b) => a - b);
  };
  const generateSurpresinha = () => {
    draftClearedRef.current = false;
    setSelectedNumbers(generateSingleRandomNumbers());
  };
  const addSurpresinhasBulk = (count: number) => {
    draftClearedRef.current = false;
    const newGames: SavedBetItem[] = [];
    for (let i = 0; i < count; i += 1) newGames.push({ id: `surpresinha-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`, numbers: generateSingleRandomNumbers() });
    setSavedGames((prev) => [...prev, ...newGames]);
  };
  const handleAddCurrentGame = () => {
    draftClearedRef.current = false;
    if (selectedNumbers.length !== numberLimit) return;
    setSavedGames((prev) => [...prev, { id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, numbers: [...selectedNumbers] }]);
    setSelectedNumbers([]);
  };
  const handleRemoveGame = (id: string) => {
    draftClearedRef.current = false;
    setSavedGames((prev) => prev.filter((g) => g.id !== id));
  };
  const handleClearAllGames = () => {
    draftClearedRef.current = true;
    setSavedGames([]);
    setSelectedNumbers([]);
    setIsPixPending(false);
    setDraftPendingPix(null, false);
    clearDraft();
  };
  const handlePoolChange = (poolId: string) => {
    if (pools.some((pool) => pool.id === poolId)) {
      draftClearedRef.current = false;
      setSelectedPoolId(poolId);
    }
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
          draftClearedRef.current = true;
          clearDraft();
          setIsPaymentSheetOpen(false);
          setIsPixPending(false);
          setSelectedNumbers([]);
          setSavedGames([]);
          setToastMessage(`Apostas confirmadas com sucesso! ${totalGamesCount} cota(s) registrada(s).`);
          setTimeout(() => navigate('/resultados'), 1200);
        },
        onError: (err: any) => alert(err?.message || 'Erro ao processar as apostas.'),
      },
    );
  };
  const generatePixPayment = () => {
    const value = Number.parseFloat(depositAmount);
    if (!Number.isFinite(value) || value < 5 || value > 5000) return;
    pixBalanceStartRef.current = walletBalance?.total ?? null;
    setIsDepositModalOpen(false);
    setIsPixSheetOpen(true);
    setPixCode(undefined);
    setPixTimer(15 * 60);
    if (pixTimerRef.current) {
      clearInterval(pixTimerRef.current);
      pixTimerRef.current = null;
    }
    depositMutation.mutate(value, {
      onSuccess: (result) => {
        setPixCode(result.pixCode);
        setIsPixPending(true);
        setDraftPendingPix(value, true);
      },
      onError: () => {
        setIsPixSheetOpen(false);
        if (pixTimerRef.current) {
          clearInterval(pixTimerRef.current);
          pixTimerRef.current = null;
        }
      },
    });
  };
  const handlePayWithPix = () => {
    setIsPaymentSheetOpen(false);
    setDepositAmount(Math.max(5, totalPrice - effectiveBalance).toFixed(2));
    setIsDepositModalOpen(true);
  };
  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setConfirmAfterAuth(false);
  }, []);

  return {
    bolao, pools, isBolaoLoading: isPoolsLoading || isBolaoLoading, isPoolsLoading,
    isLoggedIn: Boolean(session), balanceTotal: effectiveBalance, selectedNumbers, savedGames, allFinalGames, totalGamesCount, totalPrice,
    isPaymentSheetOpen, setIsPaymentSheetOpen, isDepositModalOpen, setIsDepositModalOpen, isPixSheetOpen, setIsPixSheetOpen,
    depositAmount, setDepositAmount, pixTimer, pixCode, generatePixPayment, isDepositPending: depositMutation.isPending,
    isAuthModalOpen, closeAuthModal, toastMessage, setToastMessage, toggleNumber, clearCurrentSelection, generateSurpresinha,
    addSurpresinhasBulk, handleAddCurrentGame, handleRemoveGame, handleClearAllGames, handlePoolChange, handleConfirm,
    processBalancePayment, handlePayWithPix, isProcessingPayment: placeBetsMutation.isPending, numberLimit,
  };
}
