import { supabase } from '@/integrations/supabase/client';
import { RankingParticipant } from '../types';

type Row = Record<string, any>;

function mapParticipant(row: Row): RankingParticipant {
  const name = row.name ?? row.display_name ?? 'Apostador';
  return {
    id: row.id,
    gameId: String(row.game_id ?? row.pool_id ?? ''),
    name,
    initials: row.initials ?? String(name).slice(0, 2).toUpperCase(),
    isMe: Boolean(row.is_me),
    hits: Number(row.hits ?? 0),
  };
}

export const rankingsService = {
  async getAll(gameId?: string, drawId?: string): Promise<RankingParticipant[]> {
    const { data, error } = await supabase.rpc('get_public_rankings', {
      p_pool_id: gameId ?? null,
      p_draw_id: drawId ?? null,
    });
    if (error) throw error;
    return (Array.isArray(data) ? data : []).map(mapParticipant);
  },

  async getById(id: string | number, drawId?: string): Promise<RankingParticipant | null> {
    const participants = await this.getAll(undefined, drawId);
    return participants.find((participant) => String(participant.id) === String(id)) ?? null;
  },
};
