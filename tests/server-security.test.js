// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDashboardHandler } from '../server/dashboard.js';

function responseRecorder() {
  return {
    statusCode: 0,
    setHeader: vi.fn(),
    end(text) {
      this.body = JSON.parse(text);
    },
  };
}

describe('Proteção real da API do dashboard', () => {
  let client;
  let getClient;
  let handler;

  beforeEach(() => {
    client = { auth: { getUser: vi.fn() }, from: vi.fn() };
    getClient = vi.fn(() => client);
    handler = createDashboardHandler({ getClient, getOwnerId: () => 'id-do-proprietario' });
  });

  it('rejeita leitura sem token antes de acessar o banco', async () => {
    const response = responseRecorder();
    await handler({ method: 'GET', headers: {} }, response);
    expect(response.statusCode).toBe(401);
    expect(getClient).not.toHaveBeenCalled();
    expect(client.from).not.toHaveBeenCalled();
  });

  it('rejeita token que o Supabase não reconhece', async () => {
    client.auth.getUser.mockResolvedValue({ data: { user: null }, error: { message: 'invalid' } });
    const response = responseRecorder();
    await handler({ method: 'GET', headers: { authorization: 'Bearer token-invalido' } }, response);
    expect(response.statusCode).toBe(401);
    expect(client.from).not.toHaveBeenCalled();
  });

  it('impede que outro usuário autenticado leia mensagens privadas', async () => {
    client.auth.getUser.mockResolvedValue({ data: { user: { id: 'outro-usuario' } }, error: null });
    const response = responseRecorder();
    await handler({ method: 'GET', headers: { authorization: 'Bearer token-valido' } }, response);
    expect(response.statusCode).toBe(403);
    expect(client.from).not.toHaveBeenCalled();
  });

  it('também bloqueia alterações de destaques sem autenticação', async () => {
    const response = responseRecorder();
    await handler(
      { method: 'PATCH', headers: {}, body: { action: 'feature', repoId: 42, featured: true } },
      response,
    );
    expect(response.statusCode).toBe(401);
    expect(client.from).not.toHaveBeenCalled();
  });

  it('valida o conteúdo mesmo quando o proprietário está autenticado', async () => {
    client.auth.getUser.mockResolvedValue({
      data: { user: { id: 'id-do-proprietario' } },
      error: null,
    });
    const response = responseRecorder();
    await handler(
      {
        method: 'PATCH',
        headers: { authorization: 'Bearer token-valido', 'content-type': 'application/json' },
        body: { action: 'feature', repoId: -1, featured: true },
      },
      response,
    );
    expect(response.statusCode).toBe(400);
    expect(client.from).not.toHaveBeenCalled();
  });
});
