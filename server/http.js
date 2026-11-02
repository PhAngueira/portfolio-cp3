export class HttpError extends Error {
  constructor(status, message, details = {}) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function sendJson(response, status, payload) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.statusCode = status;
  response.end(JSON.stringify(payload));
}

export function endpoint(methods, action) {
  return async function handler(request, response) {
    if (!methods.includes(request.method)) {
      response.setHeader('Allow', methods.join(', '));
      return sendJson(response, 405, { error: 'Método não permitido.' });
    }

    try {
      const result = await action(request);
      return sendJson(response, 200, result);
    } catch (error) {
      if (error instanceof HttpError) {
        return sendJson(response, error.status, { error: error.message, ...error.details });
      }
      return sendJson(response, 503, {
        error: 'Não foi possível concluir a solicitação. Tente novamente mais tarde.',
      });
    }
  };
}

export async function readJson(request) {
  const contentType = request.headers['content-type'] ?? '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    throw new HttpError(415, 'Envie os dados no formato JSON.');
  }

  let body = request.body;
  if (body === undefined) {
    const chunks = [];
    let size = 0;
    for await (const chunk of request) {
      const bytes = Buffer.from(chunk);
      size += bytes.length;
      if (size > 16_384) throw new HttpError(413, 'A mensagem ultrapassa o tamanho permitido.');
      chunks.push(bytes);
    }
    body = Buffer.concat(chunks).toString('utf8');
  }

  try {
    const serialized = typeof body === 'string' ? body : JSON.stringify(body);
    if (Buffer.byteLength(serialized, 'utf8') > 16_384) {
      throw new HttpError(413, 'A mensagem ultrapassa o tamanho permitido.');
    }
    body = typeof body === 'string' ? JSON.parse(body) : body;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, 'Não foi possível ler os dados enviados.');
  }

  if (!body || Array.isArray(body) || typeof body !== 'object') {
    throw new HttpError(400, 'Os dados enviados são inválidos.');
  }
  return body;
}

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function requireEnvironment(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new HttpError(503, 'Este serviço ainda não está disponível.');
  return value;
}
