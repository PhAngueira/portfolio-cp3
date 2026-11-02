import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { profile } from '../data/profile.js';
import Icon from './Icon.jsx';

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  const { pathname, hash } = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch {
      // O tema continua funcionando se o navegador bloquear armazenamento.
    }
  }, [theme]);

  useEffect(() => {
    const titles = {
      '/': 'Portfólio',
      '/projetos': 'Projetos',
      '/contato': 'Contato',
      '/login': 'Acesso do proprietário',
      '/dashboard': 'Dashboard',
    };
    document.title = `${titles[pathname] || 'Projeto'} — Paulo Henrique`;
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="Paulo Henrique — início" onClick={closeMenu}>
            <span className="brand-mark">
              ph<span>.</span>
            </span>
            <span className="brand-name">Paulo Henrique</span>
          </Link>
          <nav
            id="main-navigation"
            className={`main-nav ${menuOpen ? 'is-open' : ''}`}
            aria-label="Navegação principal"
            onKeyDown={(event) => {
              if (event.key === 'Escape') closeMenu();
            }}
          >
            <NavLink to="/" end onClick={closeMenu}>
              Início
            </NavLink>
            <NavLink to="/projetos" onClick={closeMenu}>
              Projetos
            </NavLink>
            <Link to="/#sobre" onClick={closeMenu}>
              Sobre
            </Link>
            <NavLink to="/contato" onClick={closeMenu}>
              Contato
              <Icon name="diagonal" size={15} />
            </NavLink>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Alternar tema"
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
            </button>
            <button
              className="icon-button menu-toggle"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              aria-controls="main-navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>
      </header>
      <main id="main-content" tabIndex="-1">
        {children}
      </main>
      <footer className="site-footer">
        <div className="container footer-top">
          <Link to="/" className="brand-mark" aria-label="Voltar ao início">
            ph<span>.</span>
          </Link>
          <p>
            Ideias em movimento.
            <br />
            <strong>Código em construção.</strong>
          </p>
          <div className="footer-links">
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub
              <Icon name="diagonal" size={15} />
            </a>
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
              LinkedIn
              <Icon name="diagonal" size={15} />
            </a>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Paulo Henrique</span>
          <span>Feito com React e atenção aos detalhes.</span>
          <Link to="/login">Área do proprietário</Link>
        </div>
      </footer>
    </>
  );
}
