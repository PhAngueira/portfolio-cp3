import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ session, loading, children }) {
  const location = useLocation();
  if (loading) return <p role="status">Verificando acesso…</p>;
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
