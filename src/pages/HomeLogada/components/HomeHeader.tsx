import React from 'react';

interface HomeHeaderProps {
  authMode: 'guest' | 'auth';
  userNickname: string;
  balanceTotal: number;
  onOpenRegister: () => void;
}

export default function HomeHeader({
  authMode,
  userNickname,
  balanceTotal,
  onOpenRegister,
}: HomeHeaderProps) {
  return (
    <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {authMode === 'auth' ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white shadow-lg border-2 border-emerald-500/30 uppercase">
              {userNickname ? userNickname.slice(0, 2) : 'ME'}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Bem-vindo de volta,</p>
              <h1 className="text-sm font-bold text-white">{userNickname || 'Maicon Eleuterio'}</h1>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
              <i className="fa-solid fa-user"></i>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Olá, Visitante</p>
              <h1 className="text-sm font-bold text-white">BS Clube</h1>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3">
          {authMode === 'auth' ? (
            <>
              <div className="text-right hidden sm:block mr-2">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Saldo Atual</p>
                <p className="text-sm font-black text-brand-gold">
                  R$ {balanceTotal.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <button 
                type="button"
                aria-label="Notificações"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition relative"
              >
                <i className="fa-regular fa-bell"></i>
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand-accent rounded-full border-2 border-slate-950"></span>
              </button>
            </>
          ) : (
            <button
              onClick={onOpenRegister}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-emerald-950/40 cursor-pointer"
            >
              <i className="fa-solid fa-user-plus text-xs"></i>
              <span>Criar Conta</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
