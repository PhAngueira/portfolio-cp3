import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Cache compartilhado da API do GitHub', () => {
  beforeEach(() => vi.resetModules());
  it('reutiliza a mesma consulta ao mudar de página e nas chamadas concorrentes', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({
        ok: true,
        headers: new Headers(),
        json: async () => [{ id: 1, name: 'projeto', fork: false }],
      });
    const { getRepositories } = await import('../src/services/github.js');
    const [first, second] = await Promise.all([getRepositories(), getRepositories()]);
    const third = await getRepositories();
    expect(first).toEqual(second);
    expect(third).toEqual(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it('explica o limite do GitHub sem inventar uma lista', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 403 });
    const { getRepositories } = await import('../src/services/github.js');
    await expect(getRepositories()).rejects.toThrow('limite');
  });
});
