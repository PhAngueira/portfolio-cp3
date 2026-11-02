import { useMemo, useState } from 'react';
import { useProjects } from '../hooks/useProjects.js';
import ProjectGrid from '../components/ProjectGrid.jsx';
import Icon from '../components/Icon.jsx';

export default function ProjectsPage() {
  const { projects, loading, error, reload } = useProjects();
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('Todas');
  const languages = useMemo(
    () => [...new Set(projects.map((project) => project.language).filter(Boolean))].sort(),
    [projects],
  );
  const filtered = projects.filter((project) => {
    const matchesSearch = `${project.name} ${project.description || ''}`
      .toLocaleLowerCase('pt-BR')
      .includes(search.toLocaleLowerCase('pt-BR'));
    return matchesSearch && (language === 'Todas' || project.language === language);
  });

  return (
    <section className="container page-section">
      <header className="page-heading">
        <p className="eyebrow">EXPLORAR / PROJETOS</p>
        <h1>
          Código em
          <br />
          <span className="serif">movimento.</span>
        </h1>
        <p>
          Uma coleção de projetos, experimentos e aprendizados. Os repositórios são atualizados
          diretamente pelo meu GitHub.
        </p>
      </header>
      <div className="project-toolbar">
        <div className="search-field">
          <Icon name="search" size={20} />
          <label className="sr-only" htmlFor="project-search">
            Buscar projetos
          </label>
          <input
            id="project-search"
            type="search"
            placeholder="Buscar por nome ou descrição"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="language-filter">
          <label htmlFor="project-language">Tecnologia</label>
          <select
            id="project-language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option>Todas</option>
            {languages.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>
      {!loading && !error && (
        <p className="result-count" role="status">
          {filtered.length} {filtered.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}
        </p>
      )}
      <ProjectGrid
        projects={filtered}
        loading={loading}
        error={error}
        onRetry={reload}
        emptyTitle={
          search || language !== 'Todas'
            ? 'Nenhum resultado para esta busca.'
            : 'Ainda não há projetos públicos.'
        }
        emptyMessage={
          search || language !== 'Todas'
            ? 'Experimente outro nome ou selecione uma tecnologia diferente.'
            : 'Os repositórios públicos aparecerão aqui automaticamente.'
        }
      />
    </section>
  );
}
