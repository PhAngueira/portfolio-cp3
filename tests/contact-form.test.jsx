import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ContactForm from '../src/components/ContactForm.jsx';
import { sendContact } from '../src/services/contact.js';

vi.mock('../src/services/contact.js', () => ({ sendContact: vi.fn() }));

function fillValidForm() {
  fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Pessoa de teste' } });
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'teste@example.com' } });
  fireEvent.change(screen.getByLabelText('Mensagem'), {
    target: { value: 'Gostaria de conversar sobre um novo projeto.' },
  });
}

describe('Comportamento do formulário', () => {
  beforeEach(() => sendContact.mockReset());

  it('exibe erros por campo sem enviar dados inválidos', () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensagem' }));
    expect(screen.getByText('Informe um e-mail válido.')).toBeInTheDocument();
    expect(
      screen.getByText('A mensagem precisa ter pelo menos 20 caracteres.'),
    ).toBeInTheDocument();
    expect(sendContact).not.toHaveBeenCalled();
  });

  it('bloqueia dois envios enquanto espera a API e mostra sucesso', async () => {
    let resolve;
    sendContact.mockReturnValue(
      new Promise((done) => {
        resolve = done;
      }),
    );
    render(<ContactForm />);
    fillValidForm();
    const form = screen.getByRole('form', { name: 'Formulário de contato' });
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(screen.getByRole('button', { name: 'Enviando…' })).toBeDisabled();
    expect(sendContact).toHaveBeenCalledTimes(1);
    await act(async () => resolve({ message: 'Recebida.' }));
    expect(screen.getByRole('status')).toHaveTextContent('Recebida.');
    expect(screen.getByLabelText('Nome')).toHaveValue('');
  });

  it('preserva dados e UUID para repetir envio após falha parcial', async () => {
    const error = Object.assign(new Error('E-mail temporariamente indisponível.'), { saved: true });
    sendContact.mockRejectedValueOnce(error).mockResolvedValueOnce({ message: 'Recebida.' });
    render(<ContactForm />);
    fillValidForm();
    fireEvent.submit(screen.getByRole('form', { name: 'Formulário de contato' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Mensagem salva; notificação pendente.',
    );
    expect(screen.getByLabelText('Nome')).toHaveValue('Pessoa de teste');
    const firstId = sendContact.mock.calls[0][1];
    fireEvent.submit(screen.getByRole('form', { name: 'Formulário de contato' }));
    await screen.findByRole('status');
    expect(sendContact.mock.calls[1][1]).toBe(firstId);
  });
});
