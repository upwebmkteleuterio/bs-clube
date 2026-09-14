import { supabase } from '@/integrations/supabase/client';
import {
  AdminWithdrawal,
  AdminUser,
  AdminCategory,
  AdminFinancialMetrics,
  AdminUsersPage,
  AdminUsersQuery,
  AdminCategoryInput,
  AdminCategoriesPage,
  AdminCategoriesQuery,
  ManualDrawInput,
  PrizeSettings,
  RegisterResultInput,
  RegisterResultOutcome,
} from '../types';

type Row = Record<string, any>;
const DEFAULT_PRIZE_SETTINGS: PrizeSettings = { housePercentage: 25, winnerPercentage: 75 };
const ADMIN_USERS_PAGE_SIZE = 10;
const ADMIN_CATEGORIES_PAGE_SIZE = 10;

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
    quotaId: pool.quota_id ? String(pool.quota_id) : undefined,
    vagas: Number(pool.total_slots ?? 0),
    filled: Number(pool.filled_slots ?? 0),
    drawDate: draw?.draw_date ?? '',
    minNumbers: Number(pool.min_numbers ?? 6),
    maxNumbers: Number(pool.max_numbers ?? 6),
    numbers: Array.isArray(draw?.numbers) ? draw.numbers.map(Number) : [],
    housePercentage: Number(pool.house_percentage ?? DEFAULT_PRIZE_SETTINGS.housePercentage),
    winnerPercentage: Number(pool.winner_percentage ?? DEFAULT_PRIZE_SETTINGS.winnerPercentage),
    status: row.status === 'inactive' ? 'inativo' : pool.status === 'closed' || pool.status === 'completed' || Number(pool.filled_slots ?? 0) >= Number(pool.total_slots ?? 0) ? 'concluido' : 'em_andamento',
  };
}

function validatePrizeSettings(settings: PrizeSettings) {
  if (
    !Number.isFinite(settings.housePercentage) ||
    !Number.isFinite(settings.winnerPercentage) ||
    settings.housePercentage < 0 ||
    settings.housePercentage > 100 ||
    settings.winnerPercentage < 0 ||
    settings.winnerPercentage > 100 ||
    Number((settings.housePercentage + settings.winnerPercentage).toFixed(2)) !== 100
  ) {
    throw new Error('Os percentuais devem estar entre 0 e 100 e somar 100%.');
  }
}

const categorySelect = '*, pools!inner(*, draws!inner(id, contest, draw_date, numbers))';

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
  if (typeof data.quotaId !== 'string' || !data.quotaId.trim()) {
    throw new Error('Selecione uma cota do catálogo.');
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
  validatePrizeSettings({
    housePercentage: data.housePercentage,
    winnerPercentage: data.winnerPercentage,
  });
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
  async getPrizeSettings(): Promise<PrizeSettings> {
    await requireAdmin();
    const { data, error } = await supabase
      .from('app_settings')
      .select('house_percentage, winner_percentage')
      .eq('id', 'global')
      .single();
    if (error) throw error;
    const settings = {
      housePercentage: Number(data.house_percentage),
      winnerPercentage: Number(data.winner_percentage),
    };
    validatePrizeSettings(settings);
    return settings;
  },

  async updatePrizeSettings(settings: PrizeSettings): Promise<PrizeSettings> {
    await requireAdmin();
    validatePrizeSettings(settings);
    const { data, error } = await supabase
      .from('app_settings')
      .update({
        house_percentage: settings.housePercentage,
        winner_percentage: settings.winnerPercentage,
      })
      .eq('id', 'global')
      .select('house_percentage, winner_percentage')
      .single();
    if (error) throw error;
    return {
      housePercentage: Number(data.house_percentage),
      winnerPercentage: Number(data.winner_percentage),
    };
  },

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

  async getCategories({ page, pageSize, status, month }: AdminCategoriesQuery): Promise<AdminCategoriesPage> {
    await requireAdmin();
    const safePageSize = Math.max(1, Math.min(pageSize || ADMIN_CATEGORIES_PAGE_SIZE, 50));
    const safePage = Math.max(1, page);
    const from = (safePage - 1) * safePageSize;
    const to = from + safePageSize - 1;
    let categoriesQuery = supabase
      .from('pool_categories')
      .select(categorySelect, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
      .in('pools.status', status === 'open' ? ['open', 'late_registration'] : ['closed', 'completed']);

    const [year, monthNumber] = month.split('-').map(Number);
    if (Number.isInteger(year) && Number.isInteger(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
      const start = `${month}-01`;
      const end = new Date(Date.UTC(year, monthNumber, 1)).toISOString().slice(0, 10);
      categoriesQuery = categoriesQuery.gte('pools.draws.draw_date', start).lt('pools.draws.draw_date', end);
    }

    const { data, count, error } = await categoriesQuery;
    if (error) throw error;
    const totalCount = count ?? 0;
    return {
      items: (data ?? []).map(mapCategory),
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / safePageSize)),
      page: safePage,
      pageSize: safePageSize,
    };
  },

  async createCategory(data: AdminCategoryInput): Promise<AdminCategory> {
    await requireAdmin();
    validateCategoryInput(data);

    const name = data.name.trim();
    const drawDate = toIsoDate(data.drawDate);
    const { data: quota, error: quotaError } = await supabase.from('quota_catalog').select('id, amount, is_active').eq('id', data.quotaId).eq('is_active', true).single();
    if (quotaError) throw quotaError;
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
      quota_id: quota.id,
      buy_in: Number(quota.amount),
      prize_estimate: 0,
      speed: 'normal',
      game_type: 'Mega-Sena',
      status: 'open',
      filled_slots: 0,
      total_slots: data.vagas,
      min_numbers: data.numbersPerBet,
      max_numbers: data.numbersPerBet,
      total_lottery_numbers: 60,
      house_percentage: data.housePercentage,
      winner_percentage: data.winnerPercentage,
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

    const { data: quota, error: quotaError } = await supabase
      .from('quota_catalog')
      .select('id, amount, is_active')
      .eq('id', data.quotaId)
      .eq('is_active', true)
      .single();
    if (quotaError) throw quotaError;

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
        quota_id: quota.id,
        buy_in: Number(quota.amount),
        total_slots: data.vagas,
        min_numbers: data.numbersPerBet,
        max_numbers: data.numbersPerBet,
        house_percentage: data.housePercentage,
        winner_percentage: data.winnerPercentage,
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

  async registerOfficialResult(input: RegisterResultInput): Promise<RegisterResultOutcome> {
    await requireAdmin();
    if (!input.poolId || !input.drawId) throw new Error('Bolão inválido para registrar o resultado.');
    if (typeof input.drawDate !== 'string' || !isValidIsoDate(toIsoDate(input.drawDate))) {
      throw new Error('Informe uma data de sorteio válida.');
    }
    validateOfficialNumbers(input.dezenas);
    const { data, error } = await supabase.rpc('register_pool_result', {
      p_pool_id: input.poolId,
      p_draw_id: input.drawId,
      p_draw_date: toIsoDate(input.drawDate),
      p_numbers: input.dezenas,
    });
    if (error) throw error;
    const outcome = (data ?? {}) as Row;
    const { data: pool, error: poolError } = await supabase
      .from('pools')
      .select('category_id')
      .eq('id', input.poolId)
      .single();
    if (poolError) throw poolError;
    const category = await readCategory(pool.category_id);
    return {
      gross: Number(outcome.gross_amount ?? 0),
      house: Number(outcome.house_amount ?? 0),
      winners: Number(outcome.winners_amount ?? 0),
      winnerCount: Number(outcome.winner_count ?? 0),
      category,
    };
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
