import { supabase } from '@/integrations/supabase/client';
import { PrizeAward } from '../types';

type PrizeAwardRow = Record<string, unknown>;

function mapPrizeAward(row: PrizeAwardRow): PrizeAward {
  return {
    id: String(row.id),
    poolId: String(row.pool_id),
    purchasedBetId: String(row.purchased_bet_id),
    hits: Number(row.hits),
    amount: Number(row.amount),
    createdAt: String(row.created_at ?? ''),
  };
}

export const prizeAwardsService = {
  async getOwnByPool(poolId: string): Promise<PrizeAward[]> {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!authData.user) return [];

    const { data, error } = await supabase
      .from('prize_awards')
      .select('id, pool_id, purchased_bet_id, hits, amount, created_at')
      .eq('user_id', authData.user.id)
      .eq('pool_id', poolId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapPrizeAward(row as PrizeAwardRow));
  },
};
