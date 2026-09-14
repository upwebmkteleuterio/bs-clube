import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWalletBalance } from '../hooks/useWallet';

export default function AppHeader() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: walletBalance } = useWalletBalance();
  const balanceTotal = walletBalance?.total ?? 0;

  return (
    <header className="w-full glass-header sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <Link
          to="/"
          aria-label="Ir para o início do BS Clube"
          className="flex items-center gap-2.5 min-w-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/50 text-lg sm:text-xl">
            <i className="fa-solid fa-clover" aria-hidden="true" />
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="font-heading font-black text-lg sm:text-xl text-white leading-none tracking-tight flex items-center gap-1">
              <span>BS CLUBE</span>
              <span className="text-[8px] sm:text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-1 sm:px-1.5 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
                Mega-Sena
              </span>
            </h1>
            <span className="text-[9px] sm:text-[11px] text-slate-400 font-medium hidden sm:block">
              Bolões da Mega-Sena no Pix
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {user ? (
            <button
              type="button"
              onClick={() => navigate('/carteira')}
              aria-label={`Abrir carteira. Saldo de R$ ${balanceTotal.toFixed(2).replace('.', ',')}`}
              className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 sm:px-3 rounded-full text-[10px] sm:text-xs font-bold text-slate-300 flex items-center gap-1.5 sm:gap-2 hover:bg-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
            >
              <i className="fa-solid fa-wallet text-emerald-400" aria-hidden="true" />
              <span className="whitespace-nowrap">R$ {balanceTotal.toFixed(2).replace('.', ',')}</span>
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-2 py-2 sm:px-3 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="bg-gradient-to-r from-emerald-500 to-brand-accent hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black py-2 px-3 sm:py-2.5 sm:px-5 rounded-lg sm:rounded-xl text-[10px] sm:text-sm shadow-lg shadow-emerald-950/50 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
