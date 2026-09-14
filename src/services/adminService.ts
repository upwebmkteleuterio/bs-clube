import { supabase } from '@/integrations/supabase/client';
import {
  AdminWithdrawal,
  AdminUser,
  AdminCategory,
  AdminFinancialMetrics,
  AdminUsersPage,
  AdminUsersQuery,
  AdminCategoryInput,
  ManualDrawInput,
  RegisterResultInput,
} from '../types';

type Row = Record<string, any>;
const ADMIN_USERS_PAGE_SIZE = 10;

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

function escapeSearchTerm(value: string) {
  return value.replace(/[\\%_(),]/g, '\\$&');
}

async function getAdminUserIds(): Promise<string[]> {
  const { data, error } = await supabase.from('user_roles').select('user_id').eq('role', 'admin');
  if (error) throw error;
  return (data ?? []).map((row) => String(row.user_id));
}

async function getWallets(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, Row>();
  const { data, error } = await supabase
    .from('wallet_accounts')
    .select('user_id, total, bonus')
    .in('user_id', userIds);
  if (error) throw error;
  return new Map((data ?? []).map((wallet) => [String(wallet.user_id), wallet as Row]));
}

function toIsoDate(value: string) {
  const parts = value.split('/');
  return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : value;
}

function isValidIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function mapCategory(row: Row): AdminCategory {
  const pools = Array.isArray(row.pools) ? row.pools : row.pools ? [row.pools] : [];
  const pool = pools[0] ?? {};
  const draw = Array.isArray(pool.draws) ? pool.draws[0] : pool.draws;
  return {
    id: String(row.id),
    poolId: pool.id ? String(pool.id) : undefined,
    drawId: pool.draw_id ? String(pool.draw_id) : draw?.id ? String(draw.id) : undefined,
    name: row.name ?? '',
    concurso: draw?.contest ?? '',
    cota: Number(pool.buy_in ?? 0),
    vagas: Number(pool.total_slots ?? 0),
    filled: Number(pool.filled_slots ?? 0),
    drawDate: draw?.draw_date ?? '',
    minNumbers: Number(pool.min_numbers ?? 6),
    maxNumbers: Number(pool.max_numbers ?? 6),
    numbers: Array.isArray(draw?.numbers) ? draw.numbers.map(Number) : [],
    status: row.status === 'inactive' ? 'inativo' : pool.status === 'completed' ? 'concluido' : 'em_andamento',
  };
}

const categorySelect = '*, pools(*, draws(id, contest, draw_date, numbers))';

async function readCategory(id: number | string): Promise<AdminCategory> {
  const { data, error } = await supabase.from('pool_categories').select(categorySelect).eq('id', String(id)).single();
  if (error) throw error;
  return mapCategory(data);
}

function validateCategoryInput(data: AdminCategoryInput) {
  if (typeof data.name !== 'string' || !data.name.trim()) {
    throw new Error('Informe o nome do bolão.');
  }
  if (
    typeof data.concurso !== 'string' ||
    !/^\d+$/.test(data.concurso.trim()) ||
    !Number.isSafeInteger(Number(data.concurso)) ||
    Number(data.concurso) <= 0
  ) {
    throw new Error('Informe um número de concurso válido.');
  }
  if (
    typeof data.cota !== 'number' ||
    !Number.isFinite(data.cota) ||
    data.cota <= 0 ||
    Number(data.cota.toFixed(2)) !== data.cota ||
    data.cota > 9999999999.99
  ) {
    throw new Error('Informe um valor de cota válido.');
  }
  if (typeof data.vagas !== 'number' || !Number.isSafeInteger(data.vagas) || data.vagas <= 0) {
    throw new Error('Informe a quantidade de vagas.');
  }
  if (typeof data.drawDate !== 'string' || !isValidIsoDate(toIsoDate(data.drawDate))) {
    throw new Error('Informe uma data de sorteio válida.');
  }
  if (
    typeof data.numbersPerBet !== 'number' ||
    !Number.isSafeInteger(data.numbersPerBet) ||
    data.numbersPerBet < 6 ||
    data.numbersPerBet > 20
  ) {
    throw new Error('A quantidade de dezenas por aposta deve estar entre 6 e 20.');
  }
}

function validateOfficialNumbers(numbers: number[]) {
  if (
    !Array.isArray(numbers) ||
    numbers.length !== 6 ||
    numbers.some((number) => !Number.isSafeInteger(number) || number < 1 || number > 60) ||
    new Set(numbers).size !== 6
  ) {
    throw new Error('Informe exatamente 6 dezenas distintas entre 01 e 60.');
  }
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
    const adminIds = await getAdminUserIds();
    let activeProfilesQuery = supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true);
    if (adminIds.length > 0) {
      activeProfilesQuery = activeProfilesQuery.not('id', 'in', `(${adminIds.join(',')})`);
    }
    const [{ data: payments, error: paymentsError }, { data: ledger, error: ledgerError }, { count, error: usersError }] = await Promise.all([
      supabase.from('payments').select('amount, kind, status'),
      supabase.from('wallet_ledger').select('amount, entry_type, status'),
      activeProfilesQuery,
    ]);
    if (paymentsError) throw paymentsError;
    if (ledgerError) throw ledgerError;
    if (usersError) throw usersError;
    const paymentRows = payments ?? [];
    const ledgerRows = ledger ?? [];
    const totalArrecadado = paymentRows
      .filter((row: Row) => row.kind === 'deposit' && row.status === 'confirmed')
      .reduce((sum: number, row: Row) => sum + Number(row.amount ?? 0), 0);
    const premiosPagos = ledgerRows
      .filter((row: Row) => row.entry_type === 'prize' && row.status === 'success')
      .reduce((sum: number, row: Row) => sum + Number(row.amount ?? 0), 0);
    return {
      totalArrecadado,
      lucroRetido: totalArrecadado - premiosPagos,
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

  async getUsers({ page, pageSize, search, status }: AdminUsersQuery): Promise<AdminUsersPage> {
    await requireAdmin();
    const adminIds = await getAdminUserIds();
    const safePageSize = Math.max(1, Math.min(pageSize || ADMIN_USERS_PAGE_SIZE, 50));
    const safePage = Math.max(1, page);
    const from = (safePage - 1) * safePageSize;
    const to = from + safePageSize - 1;
    let profilesQuery = supabase
      .from('profiles')
      .select('id, full_name, phone, avatar_url, is_active, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (adminIds.length > 0) {
      profilesQuery = profilesQuery.not('id', 'in', `(${adminIds.join(',')})`);
    }
    if (status === 'active') profilesQuery = profilesQuery.eq('is_active', true);
    if (status === 'blocked') profilesQuery = profilesQuery.eq('is_active', false);
    if (search.trim()) {
      const searchTerm = escapeSearchTerm(search.trim());
      profilesQuery = profilesQuery.or(`full_name.ilike.*${searchTerm}*,phone.ilike.*${searchTerm}*`);
    }

    const { data, count, error } = await profilesQuery;
    if (error) throw error;
    const profileRows = (data ?? []) as Row[];
    const wallets = await getWallets(profileRows.map((row) => String(row.id)));
    const items = profileRows.map((row) => mapUser({ ...row, ...(wallets.get(String(row.id)) ?? {}) }));
    const totalCount = count ?? 0;
    return {
      items,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / safePageSize)),
      page: safePage,
      pageSize: safePageSize,
    };
  },

  async toggleUserStatus(id: number | string): Promise<AdminUser> {
    await requireAdmin();
    const { error } = await supabase.rpc('toggle_user_status', { p_user_id: String(id) });
    if (error) throw error;
    const { data, error: readError } = await supabase
      .from('profiles')
      .select('id, full_name, phone, avatar_url, is_active, created_at')
      .eq('id', String(id))
      .single();
    if (readError) throw readError;
    const wallets = await getWallets([String(id)]);
    return mapUser({ ...data, ...(wallets.get(String(id)) ?? {}) });
  },

  async getCategories(): Promise<AdminCategory[]> {
    await requireAdmin();
    const { data, error } = await supabase.from('pool_categories').select(categorySelect).order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapCategory);
  },

  async createCategory(data: AdminCategoryInput): Promise<AdminCategory> {
    await requireAdmin();
    validateCategoryInput(data);

    const name = data.name.trim();
    const drawDate = toIsoDate(data.drawDate);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const { data: category, error: categoryError } = await supabase.from('pool_categories').insert({ name, slug, status: 'active' }).select('*').single();
    if (categoryError) throw categoryError;
    const { data: draw, error: drawError } = await supabase.from('draws').insert({
      contest: data.concurso.trim(),
      draw_date: drawDate,
      location: 'Caixa Econômica Federal',
      numbers: [],
      is_published: false,
    }).select('id').single();
    if (drawError) throw drawError;
    const { error: poolError } = await supabase.from('pools').insert({
      category_id: category.id,
      draw_id: draw.id,
      name,
      buy_in: data.cota,
      prize_estimate: 0,
      speed: 'normal',
      game_type: 'Mega-Sena',
      status: 'open',
      filled_slots: 0,
      total_slots: data.vagas,
      min_numbers: data.numbersPerBet,
      max_numbers: data.numbersPerBet,
      total_lottery_numbers: 60,
    });
    if (poolError) throw poolError;
    return readCategory(category.id);
  },

  async updateCategory(id: number | string, data: AdminCategoryInput): Promise<AdminCategory> {
    await requireAdmin();
    validateCategoryInput(data);
    const { data: pool, error: poolLookupError } = await supabase
      .from('pools')
      .select('id, draw_id')
      .eq('category_id', String(id))
      .single();
    if (poolLookupError) throw poolLookupError;

    const name = data.name.trim();
    const drawDate = toIsoDate(data.drawDate);
    const { error: categoryError } = await supabase
      .from('pool_categories')
      .update({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })
      .eq('id', String(id));
    if (categoryError) throw categoryError;
    const { error: poolError } = await supabase
      .from('pools')
      .update({
        name,
        buy_in: data.cota,
        total_slots: data.vagas,
        min_numbers: data.numbersPerBet,
        max_numbers: data.numbersPerBet,
      })
      .eq('id', pool.id);
    if (poolError) throw poolError;
    const { error: drawError } = await supabase
      .from('draws')
      .update({ contest: data.concurso.trim(), draw_date: drawDate })
      .eq('id', pool.draw_id);
    if (drawError) throw drawError;
    return readCategory(id);
  },

  async registerOfficialResult(input: RegisterResultInput): Promise<AdminCategory> {
    await requireAdmin();
    if (!input.poolId || !input.drawId) throw new Error('Bolão inválido para registrar o resultado.');
    if (typeof input.drawDate !== 'string' || !isValidIsoDate(toIsoDate(input.drawDate))) {
      throw new Error('Informe uma data de sorteio válida.');
    }
    validateOfficialNumbers(input.dezenas);
    const { data: pool, error: poolLookupError } = await supabase
      .from('pools')
      .select('draw_id')
      .eq('id', input.poolId)
      .single();
    if (poolLookupError) throw poolLookupError;
    if (String(pool.draw_id) !== String(input.drawId)) {
      throw new Error('O resultado não corresponde ao sorteio deste bolão.');
    }
    const { error: drawError } = await supabase
      .from('draws')
      .update({ numbers: input.dezenas, draw_date: toIsoDate(input.drawDate), is_published: true })
      .eq('id', input.drawId);
    if (drawError) throw drawError;
    const { error: poolError } = await supabase.from('pools').update({ status: 'completed' }).eq('id', input.poolId);
    if (poolError) throw poolError;
    const { data: poolCategory, error: categoryError } = await supabase
      .from('pools')
      .select('category_id')
      .eq('id', input.poolId)
      .single();
    if (categoryError) throw categoryError;
    return readCategory(poolCategory.category_id);
  },

  async executeManualDraw(input: ManualDrawInput): Promise<{ message: string; drawnNumbers: number[] }> {
    await requireAdmin();
    const contest = input.concurso.trim();
    const drawData = {
      contest,
      draw_date: toIsoDate(input.data),
      location: 'Caixa Econômica Federal',
      numbers: input.dezenas,
      is_published: true,
    };
    const { data: existingDraw, error: lookupError } = await supabase
      .from('draws')
      .select('id')
      .eq('contest', contest)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (lookupError) throw lookupError;

    if (existingDraw) {
      const { error } = await supabase.from('draws').update(drawData).eq('id', existingDraw.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('draws').insert(drawData);
      if (error) throw error;
    }

    return {
      message: `Concurso #${input.concurso} registrado com sucesso.`,
      drawnNumbers: input.dezenas,
    };
  },
};
