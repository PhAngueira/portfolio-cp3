import { describe, expect, it } from 'vitest';
import { normalizeContact, validateContact } from '../shared/contact.js';

describe('Validação do contato', () => {
  it('conta caracteres Unicode de forma compatível com o banco', () => {
    const values = { name: 'Paulo', email: 'teste@example.com', message: '😀'.repeat(10) };
    expect(validateContact(values)).toHaveProperty('message');
    expect(validateContact({ ...values, message: '😀'.repeat(20) })).toEqual({});
  });
  it('exige os três campos e informa o erro específico', () => {
    expect(Object.keys(validateContact({}))).toEqual(['name', 'email', 'message']);
  });
  it('aceita mensagem válida e normaliza espaços', () => {
    const values = {
      name: ' Paulo ',
      email: ' PAULO@example.com ',
      message: ' Gostaria de conversar sobre um projeto. ',
    };
    expect(validateContact(values)).toEqual({});
    expect(normalizeContact(values).email).toBe('paulo@example.com');
  });
  it('rejeita e-mail inválido e mensagem curta', () => {
    const errors = validateContact({ name: 'Ana', email: 'ana@', message: 'Oi' });
    expect(errors.email).toContain('válido');
    expect(errors.message).toContain('20 caracteres');
  });
  it('rejeita campos exagerados e valores de tipos inesperados', () => {
    expect(
      validateContact({ name: 'a'.repeat(101), email: {}, message: ['texto'] }),
    ).toHaveProperty('name');
    expect(validateContact({ message: 'a'.repeat(5001) }).message).toContain('5.000');
  });
});
