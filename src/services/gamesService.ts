import { supabase } from '@/integrations/supabase/client';
import { Game } from '../types';

type PoolRow = Record<string, any>;

const firstRelation = (value: unknown): Record<string, any> | undefined =>
  Array.isArray(value) ? value[0] : (value as Record<string, any> | undefined);

function mapPool(row: PoolRow): Game {
  const category = firstRelation(row.pool_categories);
  const draw = firstRelation(row.draws);
  const status = row.status as string;

  return {
    id: String(row.id),
    nome: row.name ?? '',
    buyIn: Number(row.buy_in ?? 0),
    premio: Number(row.prize_estimate ?? 0),
    velocidade: row.speed ?? '',
    tipo: row.game_type ?? '',
    estado: status === 'late_registration' ? 'Reg. Tardio' : status === 'open' ? 'Aberto' : 'Encerrado',
    inscritosAtuais: Number(row.filled_slots ?? 0),
    inscritosMax: Number(row.total_slots ?? 0),
    categoria: category?.name ?? category?.slug,
    concursoRef: draw?.contest,
    dataEncerramento: draw?.draw_date,
    createdAt: row.created_at,
  };
}

const poolSelect = '*, pool_categories(name, slug), draws(contest, draw_date, location, numbers)';

async function requireAdmin() {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error('É necessário estar autenticado.');
  const { data: isAdmin, error } = await supabase.rpc('is_admin');
  if (error) throw error;
  if (isAdmin !== true) throw new Error('Acesso administrativo necessário.');
}

export const gamesService = {
  async getAll(): Promise<Game[]> {
    const { data, error } = await supabase
      .from('pools')
      .select(poolSelect)
      .in('status', ['open', 'late_registration'])
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapPool);
  },

  async getById(id: string): Promise<Game | null> {
    const { data, error } = await supabase.from('pools').select(poolSelect).eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? mapPool(data) : null;
  },

  async create(gameData: Omit<Game, 'id'>): Promise<Game> {
    await requireAdmin();
    const { data, error } = await supabase
      .from('pools')
      .insert({
        name: gameData.nome,
        buy_in: gameData.buyIn,
        prize_estimate: gameData.premio,
        speed: gameData.velocidade,
        game_type: gameData.tipo,
        status: gameData.estado === 'Aberto' ? 'open' : gameData.estado === 'Reg. Tardio' ? 'late_registration' : 'closed',
        filled_slots: gameData.inscritosAtuais,
        total_slots: gameData.inscritosMax,
        min_numbers: 6,
        max_numbers: 6,
        total_lottery_numbers: 60,
        description: '',
      })
      .select(poolSelect)
      .single();
    if (error) throw error;
    return mapPool(data);
  },

  async update(id: string, updates: Partial<Game>): Promise<Game> {
    await requireAdmin();
    const patch: Record<string, unknown> = {};
    if (updates.nome !== undefined) patch.name = updates.nome;
    if (updates.buyIn !== undefined) patch.buy_in = updates.buyIn;
    if (updates.premio !== undefined) patch.prize_estimate = updates.premio;
    if (updates.velocidade !== undefined) patch.speed = updates.velocidade;
    if (updates.tipo !== undefined) patch.game_type = updates.tipo;
    if (updates.inscritosAtuais !== undefined) patch.filled_slots = updates.inscritosAtuais;
    if (updates.inscritosMax !== undefined) patch.total_slots = updates.inscritosMax;
    if (updates.estado !== undefined) {
      patch.status = updates.estado === 'Aberto' ? 'open' : updates.estado === 'Reg. Tardio' ? 'late_registration' : 'closed';
    }
    const { data, error } = await supabase.from('pools').update(patch).eq('id', id).select(poolSelect).single();
    if (error) throw error;
    return mapPool(data);
  },

  async delete(id: string): Promise<boolean> {
    await requireAdmin();
    const { error } = await supabase.from('pools').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};
