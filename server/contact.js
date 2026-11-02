import { createHash, createHmac } from 'node:crypto';
import { normalizeContact, validateContact } from '../shared/contact.js';
import { HttpError, UUID_PATTERN, endpoint, readJson, requireEnvironment } from './http.js';
import { checkDatabase, getServerClient } from './supabase.js';
import { sendContactEmail } from './email.js';

const MESSAGE_FIELDS = 'id,request_id,payload_hash,name,email,message,email_status,created_at';

function fingerprint(values) {
  return createHash('sha256')
    .update(JSON.stringify([values.name, values.email, values.message]))
    .digest('hex');
}

function visitorBucket(request) {
  // Em produção, o proxy da Vercel fornece esse cabeçalho; localmente usamos o socket.
  const forwarded = process.env.VERCEL ? request.headers['x-forwarded-for'] : null;
  const ip = String(forwarded || request.socket?.remoteAddress || 'local').split(',')[0].trim();
  return createHmac('sha256', requireEnvironment('SUPABASE_SECRET_KEY')).update(ip).digest('hex');
}

async function findMessage(client, requestId) {
  const { data, error } = await client
    .from('contact_messages')
    .select(MESSAGE_FIELDS)
    .eq('request_id', requestId)
    .maybeSingle();
  checkDatabase(error);
  return data;
}

async function saveMessage(client, request, values, requestId, payloadHash) {
  let existing = await findMessage(client, requestId);
  if (existing) return existing;

  const { data: allowed, error: rateError } = await client.rpc('check_contact_rate_limit', {
    p_bucket: visitorBucket(request),
  });
  checkDatabase(rateError);
  if (!allowed) {
    throw new HttpError(429, 'Muitas mensagens em pouco tempo. Aguarde 15 minutos e tente novamente.');
  }

  const { data, error } = await client
    .from('contact_messages')
    .insert({
      request_id: requestId,
      payload_hash: payloadHash,
      name: values.name,
      email: values.email,
      message: values.message,
    })
    .select(MESSAGE_FIELDS)
    .single();

  // Duas requisições simultâneas ainda representam uma única mensagem.
  if (error?.code === '23505') {
    existing = await findMessage(client, requestId);
    if (existing) return existing;
  }
  checkDatabase(error);
  return data;
}

async function updateEmailStatus(client, id, values) {
  try {
    const { error } = await client.from('contact_messages').update(values).eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export function createContactHandler({ getClient = getServerClient, sendMail = sendContactEmail } = {}) {
  return endpoint(['POST'], async (request) => {
    const body = await readJson(request);
    const fields = validateContact(body);
    if (Object.keys(fields).length) {
      throw new HttpError(400, 'Confira os campos do formulário.', { fields });
    }
    if (typeof body.requestId !== 'string' || !UUID_PATTERN.test(body.requestId)) {
      throw new HttpError(400, 'Atualize a página e tente enviar a mensagem novamente.');
    }
    const values = normalizeContact(body);
    if (values.website) throw new HttpError(400, 'Não foi possível validar o envio do formulário.');

    const client = getClient();
    const payloadHash = fingerprint(values);
    const message = await saveMessage(client, request, values, body.requestId, payloadHash);
    if (message.payload_hash !== payloadHash) {
      throw new HttpError(409, 'Os dados mudaram. Atualize a página antes de tentar novamente.');
    }
    if (message.email_status === 'sent') return { message: 'Mensagem enviada com sucesso.' };

    // O provedor conserva a chave de idempotência por 24h. Evitamos reenvio fora dessa janela.
    if (Date.now() - new Date(message.created_at).getTime() > 23 * 60 * 60 * 1000) {
      throw new HttpError(409, 'Sua mensagem já foi salva para consulta. Não é necessário reenviá-la.', {
        saved: true,
      });
    }

    let emailId;
    try {
      emailId = await sendMail(message);
    } catch {
      await updateEmailStatus(client, message.id, { email_status: 'failed' });
      throw new HttpError(
        502,
        'Sua mensagem foi salva, mas o e-mail ainda não foi confirmado. Você pode tentar novamente sem duplicar a mensagem.',
        { saved: true },
      );
    }

    const updated = await updateEmailStatus(client, message.id, {
      email_status: 'sent',
      email_id: emailId,
    });
    if (!updated) {
      throw new HttpError(
        502,
        'Sua mensagem foi salva. Não foi possível confirmar o status final; tente novamente para verificar o envio.',
        { saved: true },
      );
    }
    return { message: 'Mensagem enviada com sucesso.' };
  });
}
