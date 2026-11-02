import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

export function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Data indisponível' : date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ProjectCard({ project, index = 0 }) {
  return (
    <article className={`project-card project-card--${index % 3}`}>
      <Link className="project-cover" to={`/projetos/${encodeURIComponent(project.name)}`} tabIndex="-1" aria-hidden="true">
        <img src="/project-cover.svg" alt="" width="720" height="360" loading="lazy" decoding="async" />
        <span className="project-number">{String(index + 1).padStart(2, '0')} / PROJETO</span>
        <span className="project-cover__arrow"><Icon name="diagonal" /></span>
      </Link>
      <div className="project-card__body">
        <div className="project-tags"><span className="language-tag"><span />{project.language || 'Repositório'}</span>{project.archived && <span className="quiet-tag">Arquivado</span>}</div>
        <h3><Link to={`/projetos/${encodeURIComponent(project.name)}`}>{project.name}</Link></h3>
        <p className="project-description">{project.description || 'Explore o código, os arquivos e os detalhes deste projeto no GitHub.'}</p>
        <div className="project-meta"><span>Atualizado em {formatDate(project.updated_at)}</span><span className="star-count" aria-label={`${project.stargazers_count || 0} estrelas`}><Icon name="star" size={14} />{project.stargazers_count || 0}</span></div>
      </div>
    </article>
  );
}
