import { HttpError, requireEnvironment } from './http.js';

export async function sendContactEmail(message) {
  const apiKey = requireEnvironment('RESEND_API_KEY');
  const recipient = requireEnvironment('CONTACT_EMAIL');
  const sender = process.env.CONTACT_FROM?.trim() || 'Portfólio <onboarding@resend.dev>';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `portfolio-contact/${message.request_id}`,
    },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      reply_to: message.email,
      subject: `Contato pelo portfólio — ${message.name.replace(/[\r\n]/g, ' ').slice(0, 80)}`,
      text: `Nome: ${message.name}\nE-mail: ${message.email}\n\n${message.message}`,
    }),
    signal: AbortSignal.timeout(12_000),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.id) {
    throw new HttpError(502, 'Não foi possível enviar a notificação por e-mail.');
  }
  return payload.id;
}
