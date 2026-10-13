import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

export function ProtectedRoute({ children, redirectTo = '/login' }) {
  const { autenticado, cargando } = useAuth();
  const location = useLocation();

  if (cargando) {
    return <div className="auth-loading">Cargando sesión...</div>;
  }

  if (!autenticado) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
}
