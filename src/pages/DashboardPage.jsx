import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getAuthClient } from '../services/auth.js';
import { loadDashboard, updateDashboard } from '../services/dashboard.js';
import { useProjects } from '../hooks/useProjects.js';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import StatusPanel, { PageLoading } from '../components/StatusPanel.jsx';
import { formatDate } from '../components/ProjectCard.jsx';

export default function DashboardPage() {
  const [auth, setAuth] = useState({ session: null, loading: true, error: '' });

  useEffect(() => {
    let active = true;
    let subscription;
    try {
      const client = getAuthClient();
      client.auth
        .getSession()
        .then(({ data, error }) => {
          if (active)
            setAuth({
              session: data?.session || null,
              loading: false,
              error: error ? 'Não foi possível restaurar sua sessão.' : '',
            });
        })
        .catch(() => {
          if (active)
            setAuth({
              session: null,
              loading: false,
              error: 'Não foi possível verificar o acesso.',
            });
        });
      subscription = client.auth.onAuthStateChange((_event, session) => {
        if (active) setAuth({ session, loading: false, error: '' });
      }).data.subscription;
    } catch (error) {
      queueMicrotask(() => {
        if (active) setAuth({ session: null, loading: false, error: error.message });
      });
    }
    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (auth.error) return <Navigate to="/login" replace state={{ reason: auth.error }} />;
  return (
    <ProtectedRoute session={auth.session} loading={auth.loading}>
      <DashboardContent session={auth.session} />
    </ProtectedRoute>
  );
}

function DashboardContent({ session }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyKey, setBusyKey] = useState('');
  const mutationInProgress = useRef(false);
  const repositories = useProjects();
  const token = session?.access_token;

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await loadDashboard(token);
      setData(result);
    } catch (failure) {
      if ([401, 403].includes(failure.status)) {
        try {
          await getAuthClient().auth.signOut();
        } catch {
          /* O redirecionamento também bloqueia a interface. */
        }
        navigate('/login', {
          replace: true,
          state: { reason: 'Este acesso é reservado ao proprietário do portfólio.' },
        });
      } else {
        setError(failure.message || 'Não foi possível carregar o dashboard.');
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function changeData(payload, key) {
    if (mutationInProgress.current) return;
    mutationInProgress.current = true;
    setBusyKey(key);
    setNotice('');
    try {
      await updateDashboard(token, payload);
      setData((current) => {
        if (payload.action === 'respond')
          return {
            ...current,
            messages: current.messages.map((item) =>
              item.id === payload.id ? { ...item, responded: payload.responded } : item,
            ),
          };
        const featuredIds = payload.featured
          ? [...new Set([...current.featuredIds, payload.repoId])]
          : current.featuredIds.filter((id) => id !== payload.repoId);
        return { ...current, featuredIds };
      });
      setNotice('Alteração salva com sucesso.');
    } catch (failure) {
      setNotice(failure.message || 'Não foi possível salvar a alteração.');
    } finally {
      mutationInProgress.current = false;
      setBusyKey('');
    }
  }

  async function signOut() {
    try {
      const { error: signOutError } = await getAuthClient().auth.signOut();
      if (signOutError) throw signOutError;
      navigate('/login', { replace: true });
    } catch {
      setNotice('Não foi possível sair. Tente novamente.');
    }
  }

  if (loading) return <PageLoading />;
  if (error || !data)
    return (
      <section className="container page-section">
        <StatusPanel error title="Não foi possível abrir seu dashboard." onRetry={refresh}>
          {error}
        </StatusPanel>
      </section>
    );
  const pendingMessages = data.messages.filter((message) => !message.responded).length;

  return (
    <section className="container page-section dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">ÁREA DO PROPRIETÁRIO</p>
          <h1>
            Meu espaço<span className="accent">.</span>
          </h1>
          <p>Conversas para acompanhar. Projetos para compartilhar.</p>
        </div>
        <Button variant="secondary" onClick={signOut}>
          Sair
          <Icon name="logout" size={17} />
        </Button>
      </div>
      <div className="dashboard-stats">
        <div>
          <span>Mensagens recebidas</span>
          <strong>{data.messages.length}</strong>
        </div>
        <div>
          <span>Aguardando resposta</span>
          <strong>{pendingMessages}</strong>
        </div>
        <div>
          <span>Projetos em destaque</span>
          <strong>{data.featuredIds.length}</strong>
        </div>
      </div>
      {notice && (
        <p className="inline-notice" role="status">
          {notice}
        </p>
      )}
      <div className="dashboard-grid">
        <section className="dashboard-section" aria-labelledby="messages-title">
          <div className="dashboard-section-heading">
            <h2 id="messages-title">Caixa de entrada</h2>
            <Button variant="quiet" onClick={refresh} disabled={Boolean(busyKey)}>
              Atualizar
            </Button>
          </div>
          {!data.messages.length ? (
            <StatusPanel title="Sua caixa está vazia.">
              As mensagens enviadas pelo formulário aparecerão aqui.
            </StatusPanel>
          ) : (
            <div className="message-list">
              {data.messages.map((message) => (
                <article
                  key={message.id}
                  className={`message-card ${message.responded ? 'is-responded' : ''}`}
                >
                  <div className="message-header">
                    <strong>{message.name}</strong>
                    <span className={`message-badge ${message.responded ? 'is-done' : ''}`}>
                      {message.responded ? 'Respondida' : 'Pendente'}
                    </span>
                  </div>
                  <a className="message-email" href={`mailto:${message.email}`}>
                    {message.email}
                  </a>
                  <p className="message-body">{message.message}</p>
                  <div className="message-details">
                    <time dateTime={message.created_at}>{formatDate(message.created_at)}</time>
                    <span>
                      {message.email_status === 'sent'
                        ? 'E-mail enviado'
                        : message.email_status === 'failed'
                          ? 'Falha na notificação por e-mail'
                          : 'Notificação por e-mail pendente'}
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    disabled={Boolean(busyKey)}
                    onClick={() =>
                      changeData(
                        { action: 'respond', id: message.id, responded: !message.responded },
                        `message-${message.id}`,
                      )
                    }
                  >
                    {busyKey === `message-${message.id}` ? (
                      <>
                        <span className="spinner" />
                        Salvando…
                      </>
                    ) : message.responded ? (
                      'Marcar como pendente'
                    ) : (
                      <>
                        <Icon name="check" size={16} />
                        Marcar como respondida
                      </>
                    )}
                  </Button>
                </article>
              ))}
            </div>
          )}
        </section>
        <section className="dashboard-section" aria-labelledby="highlights-title">
          <div className="dashboard-section-heading">
            <h2 id="highlights-title">Destaques da home</h2>
          </div>
          <p className="section-description">
            Escolha os projetos que deseja apresentar primeiro. As alterações são salvas a cada
            seleção.
          </p>
          {repositories.loading ? (
            <p className="loading-inline" role="status">
              <span className="spinner" />
              Carregando projetos…
            </p>
          ) : repositories.error ? (
            <StatusPanel error title="Projetos indisponíveis" onRetry={repositories.reload}>
              {repositories.error}
            </StatusPanel>
          ) : repositories.projects.length === 0 ? (
            <StatusPanel title="Nenhum projeto disponível.">
              Publique um repositório no GitHub para destacá-lo aqui.
            </StatusPanel>
          ) : (
            <div className="featured-list">
              {repositories.projects.map((project) => (
                <label className="featured-option" key={project.id}>
                  <input
                    type="checkbox"
                    checked={data.featuredIds.includes(project.id)}
                    disabled={Boolean(busyKey)}
                    onChange={(event) =>
                      changeData(
                        { action: 'feature', repoId: project.id, featured: event.target.checked },
                        `feature-${project.id}`,
                      )
                    }
                    aria-label={`Destacar ${project.name}`}
                  />
                  <span>
                    <strong>{project.name}</strong>
                    <small>{project.language || 'Repositório'}</small>
                  </span>
                  {busyKey === `feature-${project.id}` && <span className="spinner" />}
                </label>
              ))}
            </div>
          )}
          <p className="form-note">
            Sem destaques selecionados, a home apresenta os projetos recentes.
          </p>
        </section>
      </div>
    </section>
  );
}
