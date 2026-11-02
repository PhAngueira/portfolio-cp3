import { profile } from '../data/profile.js';

const CACHE_MS = 5 * 60 * 1000;
let cache = null;
let expiresAt = 0;
let pending = null;

// O cache fica fora dos componentes: trocar de rota não repete as consultas.
export function getRepositories({ force = false } = {}) {
  if (pending) return pending;
  if (!force && cache && Date.now() < expiresAt) return Promise.resolve(cache);
  pending = fetchRepositories()
    .then((projects) => {
      cache = projects;
      expiresAt = Date.now() + CACHE_MS;
      return projects;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
}

async function fetchRepositories() {
  const projects = [];
  let page = 1;
  let hasNext = true;
  while (hasNext) {
    let response;
    try {
      response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(profile.githubUsername)}/repos?sort=updated&direction=desc&per_page=100&page=${page}`,
        { headers: { Accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(15000) },
      );
    } catch {
      throw new Error(
        'Não foi possível conectar ao GitHub. Verifique a conexão e tente novamente.',
      );
    }
    if (response.status === 403 || response.status === 429) {
      throw new Error(
        'O limite de consultas do GitHub foi atingido. Aguarde um pouco e tente novamente.',
      );
    }
    if (!response.ok) {
      throw new Error(
        response.status === 404
          ? 'O perfil informado não foi encontrado no GitHub.'
          : 'O GitHub não conseguiu carregar os projetos agora. Tente novamente.',
      );
    }
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('O GitHub retornou uma resposta inesperada.');
    projects.push(...data);
    hasNext = (response.headers.get('link') || '').includes('rel="next"');
    page += 1;
  }
  return projects.filter((project) => !project.fork);
}
