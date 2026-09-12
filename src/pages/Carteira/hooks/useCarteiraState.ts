import { useState, useEffect, useRef } from 'react';
import {
  useWalletBalance,
  useWalletTransactions,
  useDeposit,
  useWithdrawal,
} from '../../../hooks/useWallet';
import { UserTransaction } from '../../../types';

export function useCarteiraState() {
  const { data: balance, isLoading: isBalanceLoading } = useWalletBalance();
  const { data: transactions = [], isLoading: isTransactionsLoading } = useWalletTransactions();
  const depositMutation = useDeposit();
  const withdrawMutation = useWithdrawal();

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isPixSheetOpen, setIsPixSheetOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isReceiptSheetOpen, setIsReceiptSheetOpen] = useState(false);
  const [receiptTx, setReceiptTx] = useState<UserTransaction | null>(null);

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawKeyType, setWithdrawKeyType] = useState('cpf');
  const [withdrawKey, setWithdrawKey] = useState('');

  const [pixTimer, setPixTimer] = useState(15 * 60);
  const pixIntervalRef = useRef<any>(null);


  const handleDepositInput = (val: string) => {
    setDepositAmount(val);
  };

  const addDepositQuick = (val: number) => {
    const current = parseFloat(depositAmount) || 0;
    setDepositAmount((current + val).toFixed(2));
  };

  const generatePixPayment = () => {
    const val = parseFloat(depositAmount);
    if (val >= 5 && val <= 5000) {
      setIsDepositModalOpen(false);
      setIsPixSheetOpen(true);
      setPixTimer(15 * 60);
      clearInterval(pixIntervalRef.current);
      pixIntervalRef.current = setInterval(() => {
        setPixTimer((prev) => prev - 1);
      }, 1000);
    }
  };

  useEffect(() => {
    if (pixTimer <= 0) {
      clearInterval(pixIntervalRef.current);
    }
    return () => clearInterval(pixIntervalRef.current);
  }, [pixTimer]);

  const createPaymentIntent = () => {
    clearInterval(pixIntervalRef.current);
    const val = parseFloat(depositAmount);
    if (!isNaN(val) && val > 0) {
      depositMutation.mutate(val, {
        onSuccess: (result) => {
          setIsPixSheetOpen(false);
          setReceiptTx(result.transaction);
          setTimeout(() => setIsReceiptSheetOpen(true), 350);
        },
      });
    }
  };

  const setWithdrawMax = () => {
    if (balance) {
      setWithdrawAmount(balance.withdrawable.toString());
    }
  };

  const processWithdraw = () => {
    const val = parseFloat(withdrawAmount);
    if (isNaN(val) || val <= 0) return;

    withdrawMutation.mutate(
      {
        amount: val,
        pixKeyType: withdrawKeyType,
        pixKey: withdrawKey,
      },
      {
        onSuccess: (result) => {
          setIsWithdrawModalOpen(false);
          setReceiptTx(result.transaction);
          setTimeout(() => setIsReceiptSheetOpen(true), 400);
        },
        onError: (err: any) => {
          alert(err?.message || 'Erro ao processar saque.');
        },
      }
    );
  };

  const openTransactionReceipt = (tx: UserTransaction) => {
    setReceiptTx(tx);
    setIsReceiptSheetOpen(true);
  };

  return {
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
    createPaymentIntent,
    setWithdrawMax,
    processWithdraw,
    openTransactionReceipt,
    isProcessingWithdraw: withdrawMutation.isPending,
  };
}
