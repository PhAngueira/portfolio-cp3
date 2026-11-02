import { useRef, useState } from 'react';
import { normalizeContact, validateContact } from '../../shared/contact.js';
import { sendContact } from '../services/contact.js';
import Button from './Button.jsx';
import Icon from './Icon.jsx';

const initialValues = { name: '', email: '', message: '', website: '' };

export default function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const submitting = useRef(false);
  const attempt = useRef({ signature: '', id: '' });
  const busy = status.type === 'sending';

  function changeValue(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    if (status.type !== 'sending') setStatus({ type: 'idle', message: '' });
  }

  function validateField(event) {
    const name = event.target.name;
    const nextErrors = validateContact(values);
    setErrors((current) => ({ ...current, [name]: nextErrors[name] || '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting.current) return;
    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      event.currentTarget.elements.namedItem(Object.keys(nextErrors)[0])?.focus();
      return;
    }
    submitting.current = true;
    setStatus({ type: 'sending', message: '' });
    try {
      const normalized = normalizeContact(values);
      const signature = JSON.stringify(normalized);
      if (attempt.current.signature !== signature) {
        attempt.current = { signature, id: crypto.randomUUID() };
      }
      const response = await sendContact(normalized, attempt.current.id);
      setStatus({
        type: 'success',
        message: response.message || 'Mensagem enviada com sucesso. Obrigado pelo contato!',
      });
      setValues(initialValues);
      attempt.current = { signature: '', id: '' };
    } catch (error) {
      if (error.fields) setErrors(error.fields);
      setStatus({
        type: error.saved ? 'saved' : 'error',
        message: error.message || 'Não foi possível enviar a mensagem. Tente novamente.',
      });
    } finally {
      submitting.current = false;
    }
  }

  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Formulário de contato"
      aria-busy={busy}
    >
      <div className="field">
        <label htmlFor="contact-name">Nome</label>
        <input
          id="contact-name"
          name="name"
          autoComplete="name"
          placeholder="Como posso chamar você?"
          value={values.name}
          onChange={changeValue}
          onBlur={validateField}
          maxLength={100}
          required
          disabled={busy}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span className="field-error" id="name-error">
            {errors.name}
          </span>
        )}
      </div>
      <div className="field">
        <label htmlFor="contact-email">E-mail</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          value={values.email}
          onChange={changeValue}
          onBlur={validateField}
          maxLength={254}
          required
          disabled={busy}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span className="field-error" id="email-error">
            {errors.email}
          </span>
        )}
      </div>
      <div className="field">
        <div className="field-label-row">
          <label htmlFor="contact-message">Mensagem</label>
          <span>Mínimo de 20 caracteres</span>
        </div>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Conte um pouco sobre sua ideia, projeto ou oportunidade…"
          rows="6"
          value={values.message}
          onChange={changeValue}
          onBlur={validateField}
          minLength={20}
          maxLength={5000}
          required
          disabled={busy}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <span className="field-error" id="message-error">
            {errors.message}
          </span>
        )}
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          value={values.website}
          onChange={changeValue}
          autoComplete="off"
          tabIndex="-1"
        />
      </div>
      {status.type === 'success' && (
        <div className="form-feedback form-feedback--success" role="status">
          <Icon name="check" />
          <div>
            <strong>Mensagem enviada.</strong>
            <p>{status.message}</p>
          </div>
        </div>
      )}
      {['error', 'saved'].includes(status.type) && (
        <div className="form-feedback form-feedback--error" role="alert">
          <div>
            <strong>
              {status.type === 'saved'
                ? 'Mensagem salva; notificação pendente.'
                : 'O envio não foi concluído.'}
            </strong>
            <p>{status.message}</p>
            {status.type === 'saved' && (
              <p>Você pode tentar novamente com os mesmos dados. A mensagem não será duplicada.</p>
            )}
          </div>
        </div>
      )}
      <Button type="submit" disabled={busy} className="contact-submit">
        {busy ? (
          <>
            <span className="spinner" />
            Enviando…
          </>
        ) : (
          <>
            Enviar mensagem
            <Icon name="arrow" />
          </>
        )}
      </Button>
      <p className="form-note">Seu nome e e-mail serão usados para responder a este contato.</p>
    </form>
  );
}
