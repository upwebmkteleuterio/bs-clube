import { supabase } from '@/integrations/supabase/client';
import { UserTransaction, WalletActivityPage, WalletBalance, WalletTransactionFilter } from '../types';

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

  async createDeposit(amount: number): Promise<{ balance: WalletBalance; transaction: UserTransaction; pixCode?: string }> {
    await currentUser();
    if (!Number.isFinite(amount) || amount <= 0) throw new Error('Informe um valor de depósito válido.');
    const { data, error } = await supabase.rpc('create_payment_intent', {
      p_amount: amount,
      p_kind: 'deposit',
    });
    if (error) throw error;
    const row = rpcRow(data);
    const pixCodeValue = row.pix_code ?? row.qr_code ?? row.qrCode;
    const pixCode = typeof pixCodeValue === 'string' && pixCodeValue.trim() ? pixCodeValue : undefined;
    const transaction = mapPayment(row);
    return { balance: await this.getBalance(), transaction: { ...transaction, status: 'pending' }, pixCode };
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
