import React from 'react';

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateLogin: () => void;
}

export default function GuestModal({
  isOpen,
  onClose,
  onSimulateLogin,
}: GuestModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-sm rounded-3xl border border-brand-accent/40 p-6 sm:p-8 space-y-5 relative shadow-2xl text-center">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 text-slate-400 hover:text-white w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center cursor-pointer transition"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-brand-accent flex items-center justify-center font-bold text-2xl mx-auto">
          <i className="fa-solid fa-user-plus"></i>
        </div>
        <h3 className="font-heading text-xl font-extrabold text-white">Criar Conta Rápida</h3>
        <p className="text-xs text-slate-300">
          Cadastre-se rapidamente para realizar depósitos, fazer apostas e resgatar prêmios no Pix.
        </p>
        <button
          type="button"
          onClick={onSimulateLogin}
          className="w-full bg-gradient-to-r from-emerald-500 to-brand-accent text-slate-950 font-black py-3.5 rounded-xl text-sm mt-2 cursor-pointer hover:opacity-95 transition"
        >
          SIMULAR LOGIN / CADASTRO
        </button>
      </div>
    </div>
  );
}
