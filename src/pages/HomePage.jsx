import { Link } from 'react-router-dom';
import { profile } from '../data/profile.js';
import { useProjects } from '../hooks/useProjects.js';
import { useFeatured } from '../hooks/useFeatured.js';
import Icon from '../components/Icon.jsx';
import ProjectGrid from '../components/ProjectGrid.jsx';

export default function HomePage() {
  const { projects, loading, error, reload } = useProjects();
  const featured = useFeatured();
  const selected = projects.filter((project) => featured.featuredIds.includes(project.id));
  const hasHighlights = selected.length > 0;
  const visible = hasHighlights ? selected : projects.slice(0, 3);

  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="small-dot" />DESENVOLVIMENTO FRONT-END</p>
          <h1>Ideias ganham<br />vida em <span>código.</span></h1>
          <p className="hero-intro">Olá, sou <strong>{profile.shortName}</strong>.<br />{profile.bio}</p>
          <div className="hero-actions"><Link to="/projetos" className="button button--primary">Conheça meus projetos<Icon name="arrow" /></Link><Link to="/contato" className="text-link">Vamos conversar<Icon name="diagonal" size={17} /></Link></div>
          <div className="hero-note"><span>REACT</span><span>JAVASCRIPT</span><span>FIAP</span></div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-coordinate">PAULO HENRIQUE / PORTFÓLIO</div>
          <div className="art-grid"><div className="art-ring" /><span className="art-plus art-plus--one">+</span><span className="art-plus art-plus--two">+</span><span className="art-monogram">ph<span>.</span></span><span className="art-label">CRIATIVIDADE<br />ENCONTRA LÓGICA</span></div>
          <div className="art-footer"><span>IDEIA → INTERFACE</span><Icon name="diagonal" size={30} /></div>
        </div>
      </section>
      <section className="expertise-strip" aria-label="Tecnologias e áreas de interesse"><div className="container"><span>Interfaces com intenção.</span><span>React</span><span>JavaScript</span><span>HTML & CSS</span><span>Git & GitHub</span></div></section>
      <section className="container section" aria-labelledby="featured-title">
        <div className="section-heading"><div><p className="eyebrow">01 / NA PRÁTICA</p><h2 id="featured-title">{hasHighlights ? 'Projetos em destaque' : 'Projetos recentes'}<span className="accent">.</span></h2></div><Link to="/projetos" className="text-link">Explorar todos<Icon name="arrow" size={18} /></Link></div>
        {featured.error && <p className="inline-notice" role="status">A seleção de destaques está indisponível. Os projetos recentes continuam disponíveis abaixo.</p>}
        <ProjectGrid projects={visible} loading={loading || featured.loading} error={error} onRetry={reload} />
      </section>
      <section id="sobre" className="about-section">
        <div className="container about-grid">
          <div><p className="eyebrow">02 / QUEM ESTÁ POR AQUI</p><h2>Curiosidade para aprender.<br /><span className="serif">Vontade de construir.</span></h2></div>
          <div className="about-copy"><p>Sou Paulo Henrique, estudante de Engenharia de Software na FIAP, com formação em Análise e Desenvolvimento de Sistemas.</p><p>Meu foco está no desenvolvimento web: entender uma ideia, organizar a solução e transformar tudo isso em uma experiência clara para quem vai usar.</p><p>Este espaço reúne meus projetos, meus estudos e a evolução do meu trabalho com tecnologia.</p><div className="skill-list">{profile.skills.map((skill) => <span key={skill}>{skill}</span>)}</div><a className="text-link" href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">Mais sobre minha trajetória<Icon name="diagonal" size={17} /></a></div>
        </div>
      </section>
      <section className="container contact-banner"><div><p className="eyebrow">03 / PRÓXIMA CONVERSA</p><h2>Uma ideia em mente?<br /><span>Vamos construir.</span></h2></div><Link className="round-link" to="/contato" aria-label="Entrar em contato"><Icon name="diagonal" size={44} /></Link></section>
    </>
  );
}
