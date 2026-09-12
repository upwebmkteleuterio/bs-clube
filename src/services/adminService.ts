import { supabase } from '@/integrations/supabase/client';
import { AdminWithdrawal, AdminUser, AdminCategory, AdminFinancialMetrics, ManualDrawInput } from '../types';

type Row = Record<string, any>;

function mapWithdrawal(row: Row): AdminWithdrawal {
  return {
    id: String(row.id),
    user: String(row.user_id),
    amount: Number(row.amount ?? 0),
    date: row.created_at ?? '',
    pixKey: row.pix_key ?? '',
    pixType: row.pix_key_type ?? '',
    status: row.status ?? 'pending',
  };
}

function mapUser(row: Row): AdminUser {
  return {
    id: String(row.id),
    name: row.name ?? row.full_name ?? row.display_name ?? row.email ?? 'Apostador',
    phone: row.phone ?? '',
    balance: Number(row.total ?? 0),
    bonus: Number(row.bonus ?? 0),
    active: row.is_active !== false,
    createdAt: row.created_at,
  };
}

function toIsoDate(value: string) {
  const parts = value.split('/');
  return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : value;
}

function mapCategory(row: Row): AdminCategory {
  const pools = Array.isArray(row.pools) ? row.pools : row.pools ? [row.pools] : [];
  const pool = pools[0] ?? {};
  const draw = Array.isArray(pool.draws) ? pool.draws[0] : pool.draws;
  return {
    id: String(row.id),
    name: row.name ?? '',
    cota: Number(pool.buy_in ?? 0),
    vagas: Number(pool.total_slots ?? 0),
    filled: Number(pool.filled_slots ?? 0),
    drawDate: draw?.draw_date ?? '',
    status: row.status === 'inactive' ? 'inativo' : pool.status === 'completed' ? 'concluido' : 'em_andamento',
  };
}

async function requireAdmin() {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error('É necessário estar autenticado.');
  const { data: isAdmin, error } = await supabase.rpc('is_admin');
  if (error) throw error;
  if (isAdmin !== true) throw new Error('Acesso administrativo necessário.');
}

export const adminService = {
  async getMetrics(): Promise<AdminFinancialMetrics> {
    await requireAdmin();
    // Esta é uma consulta administrativa global, autorizada somente pelas políticas/RPCs de admin.
    const [{ data: payments, error: paymentsError }, { data: ledger, error: ledgerError }, { count, error: usersError }] = await Promise.all([
      supabase.from('payments').select('amount, kind, status'),
      supabase.from('wallet_ledger').select('amount, entry_type'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_active', true),
    ]);
    if (paymentsError) throw paymentsError;
    if (ledgerError) throw ledgerError;
    if (usersError) throw usersError;
    const paymentRows = payments ?? [];
    const ledgerRows = ledger ?? [];
    const totalArrecadado = paymentRows.filter((row: Row) => row.kind === 'deposit' && row.status === 'confirmed').reduce((sum: number, row: Row) => sum + Number(row.amount ?? 0), 0);
    const premiosPagos = ledgerRows.filter((row: Row) => row.entry_type === 'prize').reduce((sum: number, row: Row) => sum + Number(row.amount ?? 0), 0);
    return {
      totalArrecadado,
      lucroRetido: Math.max(0, totalArrecadado - premiosPagos),
      lucroPercent: totalArrecadado ? ((totalArrecadado - premiosPagos) / totalArrecadado) * 100 : 0,
      premiosPagos,
      premiosPercent: totalArrecadado ? (premiosPagos / totalArrecadado) * 100 : 0,
      apostadoresAtivos: count ?? 0,
    };
  },

  async getWithdrawals(): Promise<AdminWithdrawal[]> {
    await requireAdmin();
    // Consulta global excepcional: a RLS deve restringir esta leitura ao papel admin.
    const { data, error } = await supabase.from('withdrawals').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapWithdrawal);
  },

  async approveWithdrawal(id: string): Promise<AdminWithdrawal> {
    await requireAdmin();
    const { data, error } = await supabase.rpc('approve_withdrawal', { p_withdrawal_id: id });
    if (error) throw error;
    return mapWithdrawal(Array.isArray(data) ? data[0] : data);
  },

  async rejectWithdrawal(id: string): Promise<AdminWithdrawal> {
    await requireAdmin();
    const { data, error } = await supabase.rpc('reject_withdrawal', { p_withdrawal_id: id });
    if (error) throw error;
    return mapWithdrawal(Array.isArray(data) ? data[0] : data);
  },

  async getUsers(): Promise<AdminUser[]> {
    await requireAdmin();
    // Consulta administrativa global excepcional, protegida por RLS/política de admin.
    const { data, error } = await supabase.from('profiles').select('*, wallet_accounts(total, bonus)').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row: Row) => {
      const wallet = Array.isArray(row.wallet_accounts) ? row.wallet_accounts[0] : row.wallet_accounts;
      return mapUser({ ...row, ...wallet });
    });
  },

  async toggleUserStatus(id: number | string): Promise<AdminUser> {
    await requireAdmin();
    const { error } = await supabase.rpc('toggle_user_status', { p_user_id: String(id) });
    if (error) throw error;
    const { data, error: readError } = await supabase
      .from('profiles')
      .select('*, wallet_accounts(total, bonus)')
      .eq('id', String(id))
      .single();
    if (readError) throw readError;
    const wallet = Array.isArray(data.wallet_accounts) ? data.wallet_accounts[0] : data.wallet_accounts;
    return mapUser({ ...data, ...wallet });
  },

  async getCategories(): Promise<AdminCategory[]> {
    await requireAdmin();
    const { data, error } = await supabase.from('pool_categories').select('*, pools(*, draws(draw_date))').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapCategory);
  },

  async createCategory(data: { name: string; cota: number; vagas: number; drawDate: string }): Promise<AdminCategory> {
    await requireAdmin();
    const slug = data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const { data: category, error: categoryError } = await supabase.from('pool_categories').insert({ name: data.name.trim(), slug, status: 'active' }).select('*').single();
    if (categoryError) throw categoryError;
    const { data: draw, error: drawError } = await supabase.from('draws').insert({
      contest: data.name.trim(),
      draw_date: toIsoDate(data.drawDate),
      location: 'Caixa Econômica Federal',
      numbers: [],
      is_published: false,
    }).select('id').single();
    if (drawError) throw drawError;
    const { error: poolError } = await supabase.from('pools').insert({
      category_id: category.id,
      draw_id: draw.id,
      name: data.name.trim(),
      buy_in: data.cota,
      prize_estimate: 0,
      speed: 'normal',
      game_type: 'Mega-Sena',
      status: 'open',
      filled_slots: 0,
      total_slots: data.vagas,
      min_numbers: 6,
      max_numbers: 6,
      total_lottery_numbers: 60,
    });
    if (poolError) throw poolError;
    const { data: created, error: readError } = await supabase.from('pool_categories').select('*, pools(*, draws(draw_date))').eq('id', category.id).single();
    if (readError) throw readError;
    return mapCategory(created);
  },

  async updateCategory(id: number | string, data: Partial<AdminCategory>): Promise<AdminCategory> {
    await requireAdmin();
    const patch: Record<string, unknown> = {};
    if (data.name !== undefined) patch.name = data.name.trim();
    if (data.status !== undefined) patch.status = data.status === 'inativo' ? 'inactive' : 'active';
    const { data: category, error } = await supabase.from('pool_categories').update(patch).eq('id', String(id)).select('*, pools(*, draws(draw_date))').single();
    if (error) throw error;
    return mapCategory(category);
  },

  async executeManualDraw(input: ManualDrawInput): Promise<{ message: string; drawnNumbers: number[] }> {
    await requireAdmin();
    const { error } = await supabase.from('draws').insert({
      contest: input.concurso.trim(),
      draw_date: toIsoDate(input.data),
      location: 'Caixa Econômica Federal',
      numbers: input.dezenas,
      is_published: true,
    });
    if (error) throw error;
    return {
      message: `Concurso #${input.concurso} registrado com sucesso.`,
      drawnNumbers: input.dezenas,
    };
  },
};
