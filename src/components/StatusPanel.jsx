import Button from './Button.jsx';

export default function StatusPanel({ title, children, onRetry, error = false }) {
  return (
    <div
      className={`status-panel ${error ? 'status-panel--error' : ''}`}
      role={error ? 'alert' : 'status'}
    >
      <span className="status-symbol" aria-hidden="true">
        {error ? '!' : '—'}
      </span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="page-loading" role="status">
      <span className="spinner" />
      Carregando página…
    </div>
  );
}

export function ProjectSkeletons({ count = 3 }) {
  return (
    <div className="project-grid" aria-busy="true" aria-label="Carregando projetos">
      {Array.from({ length: count }, (_, index) => (
        <div className="project-card skeleton-card" key={index} aria-hidden="true">
          <div className="skeleton skeleton-cover" />
          <div className="project-card__body">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
            <div className="skeleton skeleton-tag" />
          </div>
        </div>
      ))}
      <span className="sr-only" role="status">
        Buscando projetos…
      </span>
    </div>
  );
}
