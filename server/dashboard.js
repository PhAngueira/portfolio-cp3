import { HttpError, UUID_PATTERN, endpoint, readJson } from './http.js';
import {
  authorizeOwner,
  checkDatabase,
  getServerClient,
  readBearerToken,
} from './supabase.js';

const PUBLIC_MESSAGE_FIELDS = 'id,name,email,message,created_at,responded,email_status';

async function readMessages(client) {
  const messages = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await client
      .from('contact_messages')
      .select(PUBLIC_MESSAGE_FIELDS)
      .order('created_at', { ascending: false })
      .range(offset, offset + 999);
    checkDatabase(error);
    messages.push(...data);
    if (data.length < 1000) return messages;
  }
}

export async function readFeaturedIds(client) {
  const { data, error } = await client
    .from('featured_projects')
    .select('repo_id')
    .order('created_at', { ascending: true });
  checkDatabase(error);
  return data.map((row) => Number(row.repo_id));
}

export function createDashboardHandler({
  getClient = getServerClient,
  getOwnerId = () => process.env.PORTFOLIO_OWNER_ID?.trim(),
} = {}) {
  return endpoint(['GET', 'PATCH'], async (request) => {
    const token = readBearerToken(request);
    const client = getClient();
    await authorizeOwner(client, token, getOwnerId());

    if (request.method === 'GET') {
      const [messages, featuredIds] = await Promise.all([
        readMessages(client),
        readFeaturedIds(client),
      ]);
      return { messages, featuredIds };
    }

    const body = await readJson(request);
    if (body.action === 'respond') {
      if (
        typeof body.id !== 'string' ||
        !UUID_PATTERN.test(body.id) ||
        typeof body.responded !== 'boolean'
      ) {
        throw new HttpError(400, 'Informe uma mensagem e um status válidos.');
      }
      const { data, error } = await client
        .from('contact_messages')
        .update({ responded: body.responded })
        .eq('id', body.id)
        .select('id')
        .maybeSingle();
      checkDatabase(error);
      if (!data) throw new HttpError(404, 'Esta mensagem não foi encontrada.');
      return { ok: true };
    }

    if (body.action === 'feature') {
      if (!Number.isSafeInteger(body.repoId) || body.repoId <= 0 || typeof body.featured !== 'boolean') {
        throw new HttpError(400, 'Informe um projeto e uma seleção válidos.');
      }
      const query = client.from('featured_projects');
      const { error } = body.featured
        ? await query.upsert({ repo_id: body.repoId }, { onConflict: 'repo_id' })
        : await query.delete().eq('repo_id', body.repoId);
      checkDatabase(error);
      return { ok: true };
    }

    throw new HttpError(400, 'Esta ação não é reconhecida.');
  });
}
