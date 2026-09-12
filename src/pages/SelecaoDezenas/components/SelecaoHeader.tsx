import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SelecaoHeaderProps {
  lotteryTitle?: string;
  concursoRef?: string;
  balanceTotal: number;
  isLoggedIn: boolean;
  onOpenNotifications?: () => void;
}

export default function SelecaoHeader({
  lotteryTitle = 'MEGA-SENA',
  concursoRef = 'Concurso #2780 • Caixa',
  balanceTotal,
  isLoggedIn,
  onOpenNotifications,
}: SelecaoHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="w-full glass-header sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition font-medium text-sm cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span className="hidden sm:inline">Voltar</span>
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-emerald-900/50">
            <i className="fa-solid fa-clover"></i>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-heading font-black text-lg sm:text-xl text-white leading-none">
              {lotteryTitle}
            </h1>
            <p className="text-[9px] sm:text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              {concursoRef}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isLoggedIn && (
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs font-bold text-slate-300">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="hidden sm:inline text-slate-400 font-normal">Saldo:</span>
              <span className="text-emerald-400">
                R$ {balanceTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label="Notificações"
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition relative cursor-pointer"
          >
            <i className="fa-solid fa-bell"></i>
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand-accent rounded-full border-2 border-slate-900"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
