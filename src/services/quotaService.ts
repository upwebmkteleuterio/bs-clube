import { supabase } from '@/integrations/supabase/client';
import { Quota, QuotaInput } from '@/types';

type Row = Record<string, any>;

function mapQuota(row: Row): Quota {
  return {
    id: String(row.id),
    name: row.name ?? `Cota R$ ${Number(row.amount ?? 0).toFixed(2).replace('.', ',')}`,
    amount: Number(row.amount ?? 0),
    isActive: row.is_active !== false,
    createdAt: row.created_at,
  };
}

function validateQuota(input: QuotaInput) {
  if (!input.name.trim() || input.name.trim().length > 120) throw new Error('Informe um nome de cota válido.');
  if (!Number.isFinite(input.amount) || input.amount <= 0 || input.amount > 100000) throw new Error('Informe um valor de cota válido.');
}

async function requireAdmin() {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error('É necessário estar autenticado.');
  const { data: isAdmin, error } = await supabase.rpc('is_admin');
  if (error) throw error;
  if (isAdmin !== true) throw new Error('Acesso administrativo necessário.');
}

const quotaSelect = 'id, name, amount, is_active, created_at';

export const quotaService = {
  async getActive(): Promise<Quota[]> {
    const { data, error } = await supabase.from('quota_catalog').select(quotaSelect).eq('is_active', true).order('amount');
    if (error) throw error;
    return (data ?? []).map(mapQuota);
  },

  async getAll(): Promise<Quota[]> {
    await requireAdmin();
    const { data, error } = await supabase.from('quota_catalog').select(quotaSelect).order('amount');
    if (error) throw error;
    return (data ?? []).map(mapQuota);
  },

  async create(input: QuotaInput): Promise<Quota> {
    await requireAdmin();
    validateQuota(input);
    const { data, error } = await supabase
      .from('quota_catalog')
      .insert({ name: input.name.trim(), amount: Number(input.amount.toFixed(2)), is_active: true })
      .select(quotaSelect)
      .single();
    if (error) throw error;
    return mapQuota(data);
  },

  async update(id: string, input: QuotaInput): Promise<Quota> {
    await requireAdmin();
    validateQuota(input);
    const { data, error } = await supabase
      .from('quota_catalog')
      .update({ name: input.name.trim(), amount: Number(input.amount.toFixed(2)) })
      .eq('id', id)
      .select(quotaSelect)
      .single();
    if (error) throw error;
    return mapQuota(data);
  },

  async setActive(id: string, isActive: boolean): Promise<Quota> {
    await requireAdmin();
    const { data, error } = await supabase
      .from('quota_catalog')
      .update({ is_active: isActive })
      .eq('id', id)
      .select(quotaSelect)
      .single();
    if (error) throw error;
    return mapQuota(data);
  },

  async remove(id: string): Promise<void> {
    await requireAdmin();
    const { error } = await supabase.from('quota_catalog').delete().eq('id', id);
    if (error) throw error;
  },
};

export type { QuotaInput };

export default quotaService;
