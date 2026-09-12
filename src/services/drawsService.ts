import { supabase } from '@/integrations/supabase/client';
import { OfficialDraw } from '../types';

type DrawRow = Record<string, any>;

function mapDraw(row: DrawRow): OfficialDraw {
  return {
    id: String(row.id),
    concurso: row.contest ?? '',
    data: row.draw_date ?? '',
    local: row.location ?? '',
    dezenas: Array.isArray(row.numbers) ? row.numbers.map(Number) : [],
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

export const drawsService = {
  async getAll(): Promise<OfficialDraw[]> {
    const { data, error } = await supabase
      .from('draws')
      .select('*')
      .eq('is_published', true)
      .order('draw_date', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapDraw);
  },

  async getById(id: string): Promise<OfficialDraw | null> {
    const { data, error } = await supabase.from('draws').select('*').eq('id', id).eq('is_published', true).maybeSingle();
    if (error) throw error;
    return data ? mapDraw(data) : null;
  },

  async getLatest(): Promise<OfficialDraw | null> {
    const { data, error } = await supabase
      .from('draws')
      .select('*')
      .eq('is_published', true)
      .order('draw_date', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data ? mapDraw(data) : null;
  },

  async create(drawData: Omit<OfficialDraw, 'id'>): Promise<OfficialDraw> {
    await requireAdmin();
    const { data, error } = await supabase
      .from('draws')
      .insert({
        contest: drawData.concurso,
        draw_date: drawData.data,
        location: drawData.local,
        numbers: drawData.dezenas,
        is_published: true,
      })
      .select('*')
      .single();
    if (error) throw error;
    return mapDraw(data);
  },

  async update(id: string, updates: Partial<OfficialDraw>): Promise<OfficialDraw> {
    await requireAdmin();
    const patch: Record<string, unknown> = {};
    if (updates.concurso !== undefined) patch.contest = updates.concurso;
    if (updates.data !== undefined) patch.draw_date = updates.data;
    if (updates.local !== undefined) patch.location = updates.local;
    if (updates.dezenas !== undefined) patch.numbers = updates.dezenas;
    const { data, error } = await supabase.from('draws').update(patch).eq('id', id).select('*').single();
    if (error) throw error;
    return mapDraw(data);
  },

  async delete(id: string): Promise<boolean> {
    await requireAdmin();
    const { error } = await supabase.from('draws').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};
