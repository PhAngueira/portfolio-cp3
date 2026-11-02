import { createClient } from '@supabase/supabase-js';
import { HttpError, requireEnvironment } from './http.js';

export function getServerClient() {
  return createClient(
    requireEnvironment('SUPABASE_URL'),
    requireEnvironment('SUPABASE_SECRET_KEY'),
    {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: {
        fetch: (url, options = {}) =>
          fetch(url, { ...options, signal: options.signal ?? AbortSignal.timeout(10_000) }),
      },
    },
  );
}

export function readBearerToken(request) {
  const authorization = request.headers.authorization;
  const match = typeof authorization === 'string' && authorization.match(/^Bearer (\S+)$/i);
  if (!match) throw new HttpError(401, 'Entre na sua conta para acessar o painel.');
  return match[1];
}

export async function authorizeOwner(client, token, ownerId) {
  if (!ownerId) throw new HttpError(503, 'O acesso ao painel ainda não está disponível.');
  // A sessão do navegador não é uma autorização. O servidor valida o token no Supabase.
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) throw new HttpError(401, 'Sua sessão expirou. Entre novamente.');
  if (data.user.id !== ownerId) throw new HttpError(403, 'Esta conta não tem acesso ao painel.');
  return data.user;
}

export function checkDatabase(error) {
  if (error) throw new HttpError(503, 'Não foi possível acessar os dados. Tente novamente.');
}
