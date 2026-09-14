import { supabase } from '@/integrations/supabase/client';
import { BolaoDetails, UserBet } from '../types';

type Row = Record<string, any>;

const firstRelation = (value: unknown): Row | undefined =>
  Array.isArray(value) ? value[0] : (value as Row | undefined);

function mapPool(row: Row): BolaoDetails {
  const category = firstRelation(row.pool_categories);
  const draw = firstRelation(row.draws);
  const status = row.status as string;
  return {
    id: String(row.id),
    nome: row.name ?? '',
    lottery: category?.name ?? row.game_type ?? 'Mega-Sena',
    concurso: draw?.contest ?? '',
    concursoRef: draw?.contest ?? '',
    mesaName: category?.name ?? row.name ?? '',
    dataSorteio: draw?.draw_date ?? '',
    horarioSorteio: '',
    cotaPrice: Number(row.buy_in ?? 0),
    vagasPreenchidas: Number(row.filled_slots ?? 0),
    vagasTotal: Number(row.total_slots ?? 0),
    estado: status === 'closed' || status === 'completed' ? 'Encerrada' : 'Aberta',
    minNumbers: Number(row.min_numbers ?? 6),
    maxNumbers: Number(row.max_numbers ?? 6),
    totalLotteryNumbers: Number(row.total_lottery_numbers ?? 60),
    descricao: row.description ?? '',
  };
}

function mapBet(row: Row): UserBet {
  return {
    id: String(row.id),
    bolaoId: String(row.pool_id),
    numbers: Array.isArray(row.numbers) ? row.numbers.map(Number) : [],
    createdAt: row.created_at ?? '',
    cotaPrice: Number(row.cota_price ?? 0),
  };
}

const poolSelect = '*, pool_categories(name, slug), draws(contest, draw_date, location, numbers)';

async function currentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('É necessário estar autenticado.');
  return data.user;
}

export const betsService = {
  async getBolaoDetails(id?: string): Promise<BolaoDetails> {
    let query = supabase.from('pools').select(poolSelect).in('status', ['open', 'late_registration']);
    if (id) query = query.eq('id', id);
    const { data, error } = await query.order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum bolão disponível no momento.');
    return mapPool(data);
  },

  async getAll(): Promise<UserBet[]> {
    const user = await currentUser();
    const { data, error } = await supabase
      .from('purchased_bets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapBet);
  },

  async getById(id: string): Promise<UserBet | null> {
    const user = await currentUser();
    const { data, error } = await supabase.from('purchased_bets').select('*').eq('id', id).eq('user_id', user.id).maybeSingle();
    if (error) throw error;
    return data ? mapBet(data) : null;
  },

  async placeBets(poolId: string, numberSets: number[][]): Promise<UserBet[]> {
    await currentUser();
    if (!Array.isArray(numberSets) || numberSets.length === 0 || numberSets.some((numbers) => !Array.isArray(numbers) || numbers.length < 1)) {
      throw new Error('Selecione ao menos uma aposta válida.');
    }
    const { data: pool, error: poolError } = await supabase
      .from('pools')
      .select('min_numbers, max_numbers, total_lottery_numbers')
      .eq('id', poolId)
      .maybeSingle();
    if (poolError) throw poolError;
    if (!pool) throw new Error('Bolão indisponível.');
    const requiredNumbers = Number(pool.min_numbers);
    const totalLotteryNumbers = Number(pool.total_lottery_numbers);
    if (!Number.isSafeInteger(requiredNumbers) || requiredNumbers < 1 || Number(pool.max_numbers) !== requiredNumbers || numberSets.some((numbers) => numbers.length !== requiredNumbers)) {
      throw new Error(`Cada aposta deve conter exatamente ${requiredNumbers} dezenas.`);
    }
    if (numberSets.some((numbers) => numbers.some((number) => !Number.isSafeInteger(number) || number < 1 || number > totalLotteryNumbers) || new Set(numbers).size !== requiredNumbers)) {
      throw new Error(`As dezenas devem ser distintas e estar entre 1 e ${totalLotteryNumbers}.`);
    }
    const { data, error } = await supabase.rpc('place_bets', {
      p_pool_id: poolId,
      p_number_sets: numberSets,
      p_cota_price: null,
    });
    if (error) throw error;
    const rows = Array.isArray(data) ? data : data?.purchased_bets ?? data?.bets ?? (data ? [data] : []);
    return rows.map(mapBet);
  },
};
