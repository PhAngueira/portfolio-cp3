import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuthClient } from '../services/auth.js';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(location.state?.reason || '');
  const [loading, setLoading] = useState(false);
  const busy = useRef(false);

  async function signIn(event) {
    event.preventDefault();
    if (busy.current) return;
    if (!email.trim() || !password) {
      setError('Preencha seu e-mail e sua senha.');
      return;
    }
    busy.current = true;
    setLoading(true);
    setError('');
    try {
      const client = getAuthClient();
      const { error: authError } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) throw new Error('Não foi possível entrar. Confira seu e-mail e sua senha.');
      navigate('/dashboard', { replace: true });
    } catch (failure) {
      setError(failure.message || 'O acesso está indisponível no momento.');
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }

  return (
    <section className="container login-page">
      <div className="login-panel">
        <span className="login-icon">
          <Icon name="lock" size={27} />
        </span>
        <p className="eyebrow">ÁREA DO PROPRIETÁRIO</p>
        <h1>
          Bom te ver
          <br />
          por aqui.
        </h1>
        <p className="login-description">
          Entre para acompanhar mensagens e organizar os projetos em destaque.
        </p>
        <form onSubmit={signIn} aria-busy={loading}>
          <div className="field">
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="field">
            <label htmlFor="login-password">Senha</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={loading}
            />
          </div>
          {error && (
            <p className="form-feedback form-feedback--error" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" disabled={loading} className="contact-submit">
            {loading ? (
              <>
                <span className="spinner" />
                Entrando…
              </>
            ) : (
              <>
                Entrar
                <Icon name="arrow" />
              </>
            )}
          </Button>
        </form>
        <Link className="text-link login-back" to="/">
          ← Voltar ao portfólio
        </Link>
      </div>
    </section>
  );
}
