import { createClient } from '@supabase/supabase-js';

let client;
export function getAuthClient() {
  if (client) return client;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error('O acesso administrativo ainda não está disponível.');
  }
  client = createClient(url, key);
  return client;
}
