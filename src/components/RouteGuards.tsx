import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function RequireAuth() {
  const { isLoading, session } = useAuth();
  const location = useLocation();

  if (isLoading) return <AuthLoading />;
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

export function RequireAdmin() {
  const { isLoading, role, session } = useAuth();
  const location = useLocation();

  if (isLoading) return <AuthLoading />;
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}

function AuthLoading() {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center text-emerald-400" role="status" aria-label="Carregando autenticação">
      <i className="fa-solid fa-spinner fa-spin text-2xl" />
    </div>
  );
}
