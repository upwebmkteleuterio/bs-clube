import { useState, useEffect, useRef } from 'react';
import {
  useWalletBalance,
  useWalletTransactions,
  useDeposit,
  useDepositStatus,
  useWithdrawal,
} from '../../../hooks/useWallet';
import { UserTransaction, WalletTransactionFilter } from '../../../types';

function formatWithdrawKey(value: string, type: string) {
  if (type === 'cpf') {
    const cpf = value.replace(/\D/g, '').slice(0, 11);
    if (cpf.length <= 3) return cpf;
    if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
    if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
  }
  if (type === 'phone') {
    const phone = value.replace(/\D/g, '').slice(0, 11);
    if (phone.length <= 2) return phone ? `(${phone}` : '';
    if (phone.length <= 6) return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
    if (phone.length <= 10) return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
  }
  return value.slice(0, 200);
}

export function useCarteiraState() {
  const { data: balance, isLoading: isBalanceLoading } = useWalletBalance();
  const [transactionFilter, setTransactionFilter] = useState<WalletTransactionFilter>('all');
  const {
    data: transactionPage,
    isLoading: isTransactionsLoading,
    page: transactionPageNumber,
    pageSize: transactionPageSize,
    setPage: setTransactionPage,
  } = useWalletTransactions({ pageSize: 10, filter: transactionFilter });
  const transactions = transactionPage?.items ?? [];
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

  const handleWithdrawKeyTypeChange = (value: string) => {
    setWithdrawKeyType(value);
    setWithdrawKey('');
  };

  const handleWithdrawKeyChange = (value: string) => {
    setWithdrawKey(formatWithdrawKey(value, withdrawKeyType));
  };

  const [pixTimer, setPixTimer] = useState(15 * 60);
  const [pixCode, setPixCode] = useState<string | undefined>();
  const [qrCodeBase64, setQrCodeBase64] = useState<string | undefined>();
  const [paymentId, setPaymentId] = useState<string | undefined>();
  const [depositError, setDepositError] = useState<string | undefined>();
  const [isDepositSuccess, setIsDepositSuccess] = useState(false);
  const depositStatusQuery = useDepositStatus(paymentId);
  const pixIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (depositStatusQuery.data?.status === 'confirmed') {
      setIsPixSheetOpen(false);
      setIsDepositSuccess(true);
    }
  }, [depositStatusQuery.data?.status]);

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
      setPixCode(undefined);
      setQrCodeBase64(undefined);
      setPaymentId(undefined);
      setDepositError(undefined);
      setIsDepositSuccess(false);
      setPixTimer(15 * 60);
      clearInterval(pixIntervalRef.current);
      pixIntervalRef.current = setInterval(() => {
        setPixTimer((prev) => prev - 1);
      }, 1000);
      depositMutation.mutate(val, {
        onSuccess: (result) => {
          setPixCode(result.pixCode);
          setQrCodeBase64(result.qrCodeBase64);
          setPaymentId(result.paymentId);
        },
        onError: (error) => {
          setDepositError(error instanceof Error ? error.message : 'Não foi possível criar o depósito Pix.');
          clearInterval(pixIntervalRef.current);
        },
      });
    }
  };

  useEffect(() => {
    if (pixTimer <= 0) clearInterval(pixIntervalRef.current);
  }, [pixTimer]);

  useEffect(() => {
    if (!isPixSheetOpen) clearInterval(pixIntervalRef.current);
  }, [isPixSheetOpen]);

  useEffect(() => () => clearInterval(pixIntervalRef.current), []);

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
    transactionTotalCount: transactionPage?.totalCount ?? 0,
    transactionPage: transactionPageNumber,
    transactionPageSize,
    transactionFilter,
    setTransactionFilter,
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
    handleWithdrawKeyTypeChange,
    withdrawKey,
    handleWithdrawKeyChange,
    pixTimer,
    pixCode,
    qrCodeBase64,
    paymentId,
    depositStatus: depositStatusQuery.data?.status,
    depositError,
    isDepositSuccess,
    handleDepositInput,
    addDepositQuick,
    generatePixPayment,
    setWithdrawMax,
    processWithdraw,
    openTransactionReceipt,
    isProcessingWithdraw: withdrawMutation.isPending,
  };
}
