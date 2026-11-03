import { supabase } from '@/integrations/supabase/client';
import { DepositCreationResult, DepositStatus, UserTransaction, WalletActivityPage, WalletBalance, WalletTransactionFilter } from '../types';

type Row = Record<string, any>;
type WalletActivityRpcRow = {
  id: string;
  type: UserTransaction['type'];
  title: string;
  date: string;
  value: number | string;
  status: string;
  pix_key: string | null;
  pix_key_type: string | null;
};

type WalletActivityRpcResponse = {
  items: WalletActivityRpcRow[];
  total_count: number | string;
};

function mapBalance(row: Row | null): WalletBalance {
  return {
    total: Number(row?.total ?? 0),
    withdrawable: Number(row?.withdrawable ?? 0),
    bonus: Number(row?.bonus ?? 0),
  };
}

function mapLedgerEntry(row: Row): UserTransaction {
  const entryType = String(row.entry_type ?? 'bet');
  const isWithdrawal = entryType === 'withdraw' || entryType === 'withdrawal_reversal';
  const type: UserTransaction['type'] = entryType === 'deposit' || entryType === 'prize' || isWithdrawal ? entryType === 'deposit' ? 'deposit' : entryType === 'prize' ? 'prize' : 'withdraw' : 'bet';
  const amount = Number(row.amount ?? 0);
  return {
    id: String(row.id),
    type,
    title: row.metadata?.title ?? (entryType === 'withdrawal_reversal' ? 'Saque devolvido' : type === 'deposit' ? 'Depósito Pix' : type === 'withdraw' ? 'Saque Pix' : type === 'prize' ? 'Prêmio' : 'Aposta'),
    date: row.created_at ?? '',
    value: amount,
    status: row.status ?? 'success',
  };
}

function mapPayment(row: Row): UserTransaction {
  return {
    id: String(row.id ?? row.external_id ?? ''),
    type: row.kind === 'withdraw' ? 'withdraw' : 'deposit',
    title: row.kind === 'withdraw' ? 'Saque Solicitado' : 'Depósito Pix',
    date: row.created_at ?? '',
    value: Number(row.amount ?? 0),
    status: row.status ?? 'pending',
  };
}

function mapWithdrawal(row: Row): UserTransaction {
  return {
    id: String(row.id),
    type: 'withdraw',
    title: 'Saque Solicitado',
    date: row.created_at ?? '',
    value: -Math.abs(Number(row.amount ?? 0)),
    status: row.status ?? 'pending',
    pixKeyType: row.pix_key_type,
    pixKey: row.pix_key,
  };
}

function mapActivityRow(row: WalletActivityRpcRow): UserTransaction {
  return {
    id: String(row.id),
    type: row.type,
    title: row.title,
    date: row.date,
    value: Number(row.value),
    status: row.status,
    pixKeyType: row.pix_key_type ?? undefined,
    pixKey: row.pix_key ?? undefined,
  };
}

async function currentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('É necessário estar autenticado.');
  return data.user;
}

function rpcRow(data: unknown): Row {
  if (Array.isArray(data)) return (data[0] as Row) ?? {};
  return (data as Row) ?? {};
}

export const walletService = {
  async getBalance(): Promise<WalletBalance> {
    const user = await currentUser();
    const { data, error } = await supabase.from('wallet_accounts').select('total, withdrawable, bonus').eq('user_id', user.id).maybeSingle();
    if (error) throw error;
    return mapBalance(data);
  },

  async getPage(page: number, pageSize: number, type: WalletTransactionFilter = 'all'): Promise<WalletActivityPage> {
    await currentUser();
    const safePage = Math.max(1, Math.floor(page));
    const safePageSize = Math.min(50, Math.max(1, Math.floor(pageSize)));
    const { data, error } = await supabase.rpc('get_wallet_activity', {
      p_page: safePage,
      p_page_size: safePageSize,
      p_type: type,
    });
    if (error) throw error;

    const response = (data ?? {}) as WalletActivityRpcResponse;
    return {
      items: Array.isArray(response.items) ? response.items.map(mapActivityRow) : [],
      totalCount: Number(response.total_count ?? 0),
      page: safePage,
      pageSize: safePageSize,
    };
  },

  async getById(id: string): Promise<UserTransaction | null> {
    const user = await currentUser();
    const { data: ledger, error: ledgerError } = await supabase.from('wallet_ledger').select('*').eq('id', id).eq('user_id', user.id).maybeSingle();
    if (ledgerError) throw ledgerError;
    if (ledger) return mapLedgerEntry(ledger);
    const { data: payment, error: paymentError } = await supabase.from('payments').select('*').eq('id', id).eq('user_id', user.id).maybeSingle();
    if (paymentError) throw paymentError;
    if (payment) return mapPayment(payment);
    const { data: withdrawal, error: withdrawalError } = await supabase.from('withdrawals').select('*').eq('id', id).eq('user_id', user.id).maybeSingle();
    if (withdrawalError) throw withdrawalError;
    return withdrawal ? mapWithdrawal(withdrawal) : null;
  },

  async createDeposit(amount: number): Promise<DepositCreationResult> {
    const user = await currentUser();
    if (!Number.isFinite(amount) || amount < 5 || amount > 5000) throw new Error('O valor do depósito deve ser entre R$ 5,00 e R$ 5.000,00.');
    const { data, error } = await supabase.functions.invoke('pushinpay-create-charge', { body: { amount } });
    if (error) {
      const context = (error as { context?: unknown }).context;
      if (context instanceof Response) {
        let errorBody: { error?: unknown; message?: unknown } | null = null;
        try {
          errorBody = await context.clone().json();
        } catch {
          errorBody = null;
        }
        if (typeof errorBody?.error === 'string' && errorBody.error.trim()) throw new Error(errorBody.error);
        if (typeof errorBody?.message === 'string' && errorBody.message.trim()) throw new Error(errorBody.message);
      }
      throw new Error('Não foi possível criar o depósito Pix. Tente novamente.');
    }

    const result = data as { paymentId?: string; qrCode?: string | null; qrCodeBase64?: string | null; expiresAt?: string };
    if (!result?.paymentId || !result.expiresAt) throw new Error('A resposta do serviço de pagamento é inválida.');
    const { data: payment, error: paymentError } = await supabase.from('payments').select('*').eq('id', result.paymentId).eq('user_id', user.id).single();
    if (paymentError) throw paymentError;
    const transaction = mapPayment(payment);
    return {
      balance: await this.getBalance(),
      transaction: { ...transaction, status: 'pending' },
      pixCode: typeof result.qrCode === 'string' ? result.qrCode : undefined,
      qrCodeBase64: typeof result.qrCodeBase64 === 'string' ? result.qrCodeBase64 : undefined,
      paymentId: result.paymentId,
      expiresAt: result.expiresAt,
    };
  },

  async getDepositStatus(paymentId: string): Promise<DepositStatus> {
    const user = await currentUser();
    const { data, error } = await supabase.from('payments').select('id, status, provider_status, amount, paid_at')
      .eq('id', paymentId).eq('user_id', user.id).single();
    if (error) throw error;
    const allowedStatuses: DepositStatus['status'][] = ['pending', 'confirmed', 'canceled', 'failed'];
    const status = allowedStatuses.includes(data.status as DepositStatus['status'])
      ? data.status as DepositStatus['status']
      : 'pending';
    return { id: data.id, status, paidAt: data.paid_at };
  },

  async createWithdrawal(amount: number, pixKeyType: string, pixKey: string): Promise<{ balance: WalletBalance; transaction: UserTransaction }> {
    await currentUser();
    if (!Number.isFinite(amount) || amount <= 0 || !pixKey.trim()) throw new Error('Confira o valor e a chave Pix.');
    const { data, error } = await supabase.rpc('request_withdrawal', {
      p_amount: amount,
      p_pix_key_type: pixKeyType,
      p_pix_key: pixKey.trim(),
    });
    if (error) throw error;
    const row = rpcRow(data);
    const transaction = mapWithdrawal(row);
    return { balance: await this.getBalance(), transaction };
  },
};
