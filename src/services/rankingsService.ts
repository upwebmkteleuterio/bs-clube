import { supabase } from '@/integrations/supabase/client';
import { RankingParticipant } from '../types';

type Row = Record<string, any>;

function mapParticipant(row: Row): RankingParticipant {
  const name = row.name ?? row.display_name ?? 'Apostador';
  return {
    id: row.id ?? row.user_id,
    gameId: String(row.game_id ?? row.pool_id ?? ''),
    name,
    initials: row.initials ?? String(name).slice(0, 2).toUpperCase(),
    numbers: Array.isArray(row.numbers) ? row.numbers.map(Number) : [],
    isMe: Boolean(row.is_me),
    hits: row.hits == null ? undefined : Number(row.hits),
  };
}

export const rankingsService = {
  async getAll(gameId?: string): Promise<RankingParticipant[]> {
    const { data, error } = await supabase.rpc('get_public_rankings', {
      p_pool_id: gameId ?? null,
    });
    if (error) throw error;
    return (Array.isArray(data) ? data : []).map(mapParticipant);
  },

  async getById(id: string | number): Promise<RankingParticipant | null> {
    const participants = await this.getAll();
    return participants.find((participant) => String(participant.id) === String(id)) ?? null;
  },
};
