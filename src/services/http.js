export async function requestJson(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      signal: options.signal ?? AbortSignal.timeout(20000),
      headers: { Accept: 'application/json', ...options.headers },
    });
  } catch {
    throw new Error('Não foi possível conectar. Verifique sua conexão e tente novamente.');
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('O serviço está indisponível no momento. Tente novamente mais tarde.');
  }
  if (!response.ok) {
    const error = new Error(data.error || 'Não foi possível concluir a solicitação.');
    error.status = response.status;
    error.fields = data.fields;
    error.saved = data.saved;
    throw error;
  }
  return data;
}
