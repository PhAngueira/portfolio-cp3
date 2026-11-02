import { Link, useParams } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects.js';
import { formatDate } from '../components/ProjectCard.jsx';
import StatusPanel, { PageLoading } from '../components/StatusPanel.jsx';
import Icon from '../components/Icon.jsx';

function publicUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export default function ProjectPage() {
  const { repoName } = useParams();
  const { projects, loading, error, reload } = useProjects();
  if (loading) return <PageLoading />;
  if (error) return <section className="container page-section"><StatusPanel error title="Não foi possível carregar este projeto." onRetry={reload}>{error.message}</StatusPanel></section>;
  const project = projects.find((item) => item.name.toLowerCase() === repoName.toLowerCase());
  if (!project) return <section className="container page-section"><StatusPanel title="Projeto não encontrado.">Este repositório pode ter sido renomeado ou não estar público.</StatusPanel><Link to="/projetos" className="button button--primary">Explorar outros projetos<Icon name="arrow" /></Link></section>;
  const homepage = publicUrl(project.homepage);

  return (
    <article className="container page-section project-detail">
      <Link to="/projetos" className="text-link back-link"><span aria-hidden="true">←</span>Todos os projetos</Link>
      <header className="project-detail__heading"><p className="eyebrow">PROJETO / {project.language || 'REPOSITÓRIO'}</p><h1>{project.name}</h1><p>{project.description || 'Um projeto do meu percurso de aprendizado e desenvolvimento. Explore o repositório para conhecer a implementação e os arquivos.'}</p><div className="hero-actions"><a href={project.html_url} target="_blank" rel="noopener noreferrer" className="button button--primary">Ver código no GitHub<Icon name="diagonal" /></a>{homepage && <a href={homepage} target="_blank" rel="noopener noreferrer" className="button button--secondary">Abrir projeto<Icon name="diagonal" /></a>}</div></header>
      <img className="project-detail__cover" src="/project-cover.svg" width="720" height="360" alt="Composição geométrica com símbolos de código" loading="lazy" decoding="async" />
      <div className="project-detail__grid"><section><h2>Sobre o repositório</h2><p>{project.description || 'A descrição deste projeto ainda não foi adicionada ao GitHub.'}</p><p>O código-fonte, as instruções de execução e o histórico de alterações podem ser consultados no repositório.</p>{project.topics?.length > 0 && <div className="skill-list">{project.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>}</section><dl className="project-facts"><div><dt>Linguagem principal</dt><dd>{project.language || 'Não informada'}</dd></div><div><dt>Última atualização</dt><dd>{formatDate(project.updated_at)}</dd></div><div><dt>Criado em</dt><dd>{formatDate(project.created_at)}</dd></div><div><dt>Estrelas</dt><dd>{project.stargazers_count || 0}</dd></div><div><dt>Licença</dt><dd>{project.license?.name || 'Não informada'}</dd></div></dl></div>
    </article>
  );
}
