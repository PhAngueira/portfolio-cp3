import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../src/components/ProtectedRoute.jsx';

function renderAccess(session, loading = false) {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/login" element={<h1>Login do proprietário</h1>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute session={session} loading={loading}>
              <h1>Mensagens privadas</h1>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Proteção do dashboard', () => {
  it('redireciona visitante sem sessão e não renderiza mensagens', () => {
    renderAccess(null);
    expect(screen.getByRole('heading', { name: 'Login do proprietário' })).toBeInTheDocument();
    expect(screen.queryByText('Mensagens privadas')).not.toBeInTheDocument();
  });
  it('aguarda a restauração da sessão sem exibir o conteúdo privado', () => {
    renderAccess(null, true);
    expect(screen.getByRole('status')).toHaveTextContent('Verificando');
    expect(screen.queryByText('Mensagens privadas')).not.toBeInTheDocument();
  });
  it('permite a interface autenticada; o servidor faz a autorização do dono', () => {
    renderAccess({ user: { id: 'owner' } });
    expect(screen.getByRole('heading', { name: 'Mensagens privadas' })).toBeInTheDocument();
  });
});
