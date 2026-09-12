import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ResultadosBottomBarProps {
  authMode: 'guest' | 'auth';
  balanceTotal: number;
  onOpenGuestModal: () => void;
}

export default function ResultadosBottomBar({
  authMode,
  balanceTotal,
  onOpenGuestModal,
}: ResultadosBottomBarProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-[68px] left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        {authMode === 'guest' ? (
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center text-slate-500">
                <i className="fa-solid fa-user-lock"></i>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Faça parte
                </p>
                <p className="text-sm font-bold text-white">Cadastre-se para jogar</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenGuestModal}
              className="bg-gradient-to-r from-emerald-500 to-brand-accent text-slate-950 font-black py-2.5 px-5 rounded-xl text-xs shadow-lg shadow-emerald-950/50 cursor-pointer"
            >
              CRIAR CONTA
            </button>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center text-emerald-400">
                <i className="fa-solid fa-wallet"></i>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Seu Saldo
                </p>
                <p className="text-sm font-bold text-white">
                  R$ {balanceTotal.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/carteira')}
              className="bg-gradient-to-r from-emerald-500 to-brand-accent text-slate-950 font-black py-2.5 px-6 rounded-xl text-xs shadow-lg shadow-emerald-950/50 flex items-center space-x-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-plus"></i>
              <span>DEPOSITAR</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
