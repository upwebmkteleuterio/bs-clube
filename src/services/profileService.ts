import { supabase } from '@/integrations/supabase/client';
import { PixKeyType, ProfileUpdate, UserProfile } from '../types';

type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  cpf: string | null;
  avatar_url: string | null;
  pix_key_type: PixKeyType | null;
  pix_key: string | null;
  created_at: string;
  updated_at: string;
};

const profileSelect = 'id, full_name, phone, cpf, avatar_url, pix_key_type, pix_key, created_at, updated_at';

async function currentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('É necessário estar autenticado.');
  return data.user;
}

function mapProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    cpf: row.cpf,
    avatarUrl: row.avatar_url,
    pixKeyType: row.pix_key_type,
    pixKey: row.pix_key,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function isValidCpf(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 11 || /^([0-9])\1+$/.test(digits)) return false;
  let sum = 0;
  for (let index = 0; index < 9; index += 1) sum += Number(digits[index]) * (10 - index);
  let digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== Number(digits[9])) return false;
  sum = 0;
  for (let index = 0; index < 10; index += 1) sum += Number(digits[index]) * (11 - index);
  digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  return digit === Number(digits[10]);
}

function validatePixKey(type: PixKeyType, value: string) {
  if (!value) throw new Error('Informe a chave Pix.');
  if (value.length > 200) throw new Error('A chave Pix deve ter no máximo 200 caracteres.');
  if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error('Informe um e-mail válido para a chave Pix.');
  if (type === 'cpf' && !isValidCpf(value)) throw new Error('Informe um CPF válido para a chave Pix.');
  if (type === 'phone' && ![10, 11].includes(value.replace(/\D/g, '').length)) throw new Error('Informe um telefone brasileiro válido para a chave Pix.');
}

function normalizeUpdate(updates: ProfileUpdate) {
  const fullName = updates.fullName?.trim() || null;
  const phone = updates.phone ? updates.phone.replace(/\D/g, '') || null : null;
  const avatarUrl = updates.avatarUrl?.trim() || null;
  const hasPixUpdate = updates.pixKeyType !== undefined || updates.pixKey !== undefined;
  const pixKeyType = updates.pixKeyType || null;
  const pixKey = updates.pixKey?.trim() || null;

  if (!fullName) throw new Error('Informe nome e sobrenome.');
  if (fullName.length > 200) throw new Error('O nome deve ter no máximo 200 caracteres.');
  if (fullName.split(/\s+/).filter(Boolean).length < 2) throw new Error('Informe nome e sobrenome.');
  if (phone && phone.length > 30) throw new Error('O telefone deve ter no máximo 30 caracteres.');
  if (avatarUrl && avatarUrl.length > 500) throw new Error('A URL do avatar deve ter no máximo 500 caracteres.');
  if (avatarUrl) {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(avatarUrl);
    } catch {
      throw new Error('Informe uma URL de avatar válida.');
    }
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('A URL do avatar deve usar HTTP ou HTTPS.');
  }
  if (hasPixUpdate && (pixKeyType || pixKey)) {
    if (!pixKeyType || !['cpf', 'email', 'phone', 'random'].includes(pixKeyType)) throw new Error('Informe um tipo de chave Pix válido.');
    validatePixKey(pixKeyType, pixKey ?? '');
  }

  const update = { full_name: fullName, phone, avatar_url: avatarUrl } as Record<string, string | null>;
  if (hasPixUpdate) {
    update.pix_key_type = pixKeyType;
    update.pix_key = pixKey;
  }
  return update;
}

export const profileService = {
  async getCurrent(): Promise<UserProfile | null> {
    const user = await currentUser();
    const { data, error } = await supabase
      .from('profiles')
      .select(profileSelect)
      .eq('id', user.id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapProfile(data as ProfileRow) : null;
  },

  async updateCurrent(updates: ProfileUpdate): Promise<UserProfile> {
    const user = await currentUser();
    const { data, error } = await supabase
      .from('profiles')
      .update(normalizeUpdate(updates))
      .eq('id', user.id)
      .select(profileSelect)
      .single();
    if (error) throw error;
    return mapProfile(data as ProfileRow);
  },
};
