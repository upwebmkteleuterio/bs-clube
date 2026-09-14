import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import AuthPanel, { AuthView } from '../components/AuthPanel';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage({ view }: { view: AuthView }) {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { from?: string; bolaoId?: string } | null;
  const returnTo = locationState?.from || '/';

  useEffect(() => {
    if (session) navigate(returnTo, { replace: true, state: location.state });
  }, [location.state, navigate, returnTo, session]);

  const handleViewChange = (nextView: AuthView) => {
    navigate(nextView === 'sign_in' ? '/login' : '/cadastro', { state: location.state });
  };

  return (
    <div className="min-h-screen bg-brand-dark text-slate-50">
      <AppHeader />
      <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <AuthPanel view={view} onViewChange={handleViewChange} />
          <div className="mt-6 text-center text-sm text-slate-400">
            {view === 'sign_in' ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'}{' '}
            <button type="button" onClick={() => handleViewChange(view === 'sign_in' ? 'sign_up' : 'sign_in')} className="font-bold text-emerald-400 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/70">
              {view === 'sign_in' ? 'Cadastre-se' : 'Entrar'}
            </button>
          </div>
          <Link to="/" className="mt-4 block text-center text-xs text-slate-500 hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/70">Voltar para o início</Link>
        </div>
      </main>
    </div>
  );
}
