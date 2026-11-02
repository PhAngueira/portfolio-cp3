// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createContactHandler } from '../server/contact.js';

const validBody = {
  name: 'Visitante de teste',
  email: 'visitante@example.test',
  message: 'Gostaria de conversar sobre um projeto de desenvolvimento web.',
  website: '',
  requestId: '11111111-1111-4111-8111-111111111111',
};

function request(body = validBody) {
  return {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    socket: { remoteAddress: '127.0.0.1' },
    body,
  };
}

function responseRecorder() {
  return {
    statusCode: 0,
    setHeader: vi.fn(),
    end(text) {
      this.body = JSON.parse(text);
    },
  };
}

// Simula o contrato do banco, sem rede, credenciais ou e-mails reais.
function fakeDatabase() {
  let record = null;
  const insert = vi.fn();
  const client = {
    insert,
    rpc: vi.fn(async () => ({ data: true, error: null })),
    from: vi.fn(() => {
      const query = {
        select: () => query,
        eq: () => query,
        neq: () => query,
        maybeSingle: async () => ({ data: record ? { ...record } : null, error: null }),
        insert(values) {
          insert(values);
          record = {
            id: '22222222-2222-4222-8222-222222222222',
            created_at: new Date().toISOString(),
            email_status: 'pending',
            ...values,
          };
          return query;
        },
        single: async () => ({ data: { ...record }, error: null }),
        update(values) {
          record = { ...record, ...values };
          return query;
        },
        then(resolve) {
          resolve({ error: null });
        },
      };
      return query;
    }),
  };
  return client;
}

describe('Contato: validação e entrega sem duplicação', () => {
  beforeEach(() => {
    vi.stubEnv('SUPABASE_SECRET_KEY', 'chave-ficticia-apenas-do-teste');
    vi.stubEnv('VERCEL', '');
  });
  afterEach(() => vi.unstubAllEnvs());

  it('não salva nem envia campos inválidos', async () => {
    const getClient = vi.fn();
    const sendMail = vi.fn();
    const handler = createContactHandler({ getClient, sendMail });
    const response = responseRecorder();
    await handler(request({ ...validBody, email: 'invalido', message: 'Curta' }), response);
    expect(response.statusCode).toBe(400);
    expect(response.body.fields.email).toBeTruthy();
    expect(response.body.fields.message).toBeTruthy();
    expect(getClient).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('rejeita o honeypot antes de acessar os serviços', async () => {
    const getClient = vi.fn();
    const sendMail = vi.fn();
    const response = responseRecorder();
    await createContactHandler({ getClient, sendMail })(
      request({ ...validBody, website: 'https://spam.example.test' }),
      response,
    );
    expect(response.statusCode).toBe(400);
    expect(getClient).not.toHaveBeenCalled();
  });

  it('informa falha parcial e permite repetir sem criar outra mensagem', async () => {
    const client = fakeDatabase();
    const sendMail = vi
      .fn()
      .mockRejectedValueOnce(new Error('Provedor indisponível'))
      .mockResolvedValueOnce('email-id-de-teste');
    const handler = createContactHandler({ getClient: () => client, sendMail });
    const first = responseRecorder();
    await handler(request(), first);
    expect(first.statusCode).toBe(502);
    expect(first.body.saved).toBe(true);

    const retry = responseRecorder();
    await handler(request(), retry);
    expect(retry.statusCode).toBe(200);
    expect(client.insert).toHaveBeenCalledTimes(1);
    expect(client.rpc).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledTimes(2);
  });

  it('não reenvia um contato que já foi confirmado', async () => {
    const client = fakeDatabase();
    const sendMail = vi.fn().mockResolvedValue('email-id-de-teste');
    const handler = createContactHandler({ getClient: () => client, sendMail });
    await handler(request(), responseRecorder());
    const repeat = responseRecorder();
    await handler(request(), repeat);
    expect(repeat.statusCode).toBe(200);
    expect(client.insert).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledTimes(1);
  });

  it('respeita a limitação de novos contatos no banco', async () => {
    const client = fakeDatabase();
    client.rpc.mockResolvedValue({ data: false, error: null });
    const sendMail = vi.fn();
    const response = responseRecorder();
    await createContactHandler({ getClient: () => client, sendMail })(request(), response);
    expect(response.statusCode).toBe(429);
    expect(client.insert).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });
});
