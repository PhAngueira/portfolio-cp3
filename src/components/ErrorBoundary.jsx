import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="container error-page">
          <span className="eyebrow">Vamos tentar de novo</span>
          <h1>Algo não carregou como esperado.</h1>
          <p>Atualize a página para continuar explorando o portfólio.</p>
          <button className="button button--primary" onClick={() => window.location.reload()}>Atualizar página</button>
        </main>
      );
    }
    return this.props.children;
  }
}
