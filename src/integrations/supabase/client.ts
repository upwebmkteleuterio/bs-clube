import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hwufsnhkdiqqtppbdrzs.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_YClLqIFIAxCs4OBNIsHLZw_UBgaMb91';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
