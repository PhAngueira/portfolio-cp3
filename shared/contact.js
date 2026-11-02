// Validação pura: a mesma regra é utilizada no navegador e no servidor.
export function normalizeContact(values = {}) {
  const text = (value) => (typeof value === 'string' ? value.trim() : '');
  return {
    name: text(values.name),
    email: text(values.email).toLowerCase(),
    message: text(values.message),
    website: text(values.website),
  };
}

export function validateContact(values = {}) {
  const { name, email, message } = normalizeContact(values);
  const nameLength = Array.from(name).length;
  const messageLength = Array.from(message).length;
  const errors = {};
  if (nameLength < 2) errors.name = 'Informe seu nome com pelo menos 2 caracteres.';
  else if (nameLength > 100) errors.name = 'O nome deve ter no máximo 100 caracteres.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    errors.email = 'Informe um e-mail válido.';
  }
  if (messageLength < 20) errors.message = 'A mensagem precisa ter pelo menos 20 caracteres.';
  else if (messageLength > 5000) errors.message = 'A mensagem deve ter no máximo 5.000 caracteres.';
  return errors;
}
