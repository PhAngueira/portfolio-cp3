import ProjectCard from './ProjectCard.jsx';
import StatusPanel, { ProjectSkeletons } from './StatusPanel.jsx';

export default function ProjectGrid({
  projects = [],
  loading,
  error,
  onRetry,
  emptyTitle = 'Nenhum projeto por aqui ainda.',
  emptyMessage = 'Novos projetos aparecerão nesta área assim que estiverem disponíveis.',
}) {
  if (loading) return <ProjectSkeletons />;
  if (error)
    return (
      <StatusPanel error title="Não foi possível carregar os projetos." onRetry={onRetry}>
        {error}
      </StatusPanel>
    );
  if (!projects.length) return <StatusPanel title={emptyTitle}>{emptyMessage}</StatusPanel>;
  return (
    <div className="project-grid">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
