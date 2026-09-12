import React, { useState } from 'react';

interface GuestRestrictedCardProps {
  onSimulateLogin: () => void;
}

export default function GuestRestrictedCard({
  onSimulateLogin,
}: GuestRestrictedCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmLogin = () => {
    setIsModalOpen(false);
    onSimulateLogin();
  };

  return (
    <>
      <div className="glass-card rounded-3xl p-8 text-center space-y-5 border border-slate-800 mt-10">
        <div className="w-20 h-20 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center text-4xl text-slate-500 mx-auto">
          <i className="fa-solid fa-lock"></i>
        </div>
        <div>
          <h2 className="font-heading text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Crie sua conta ou faça login para acessar sua carteira, realizar depósitos via Pix e
            solicitar saques dos seus prêmios.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-emerald-500 to-brand-accent text-slate-950 font-black py-3.5 px-8 rounded-xl text-sm shadow-lg shadow-emerald-950/50 hover:opacity-90 transition inline-block cursor-pointer"
        >
          CRIAR CONTA OU ENTRAR
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-sm rounded-3xl border border-brand-accent/40 p-6 sm:p-8 space-y-5 relative shadow-2xl text-center">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label="Fechar"
              className="absolute top-4 right-4 text-slate-400 hover:text-white w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-brand-accent flex items-center justify-center font-bold text-2xl mx-auto">
              <i className="fa-solid fa-user-plus"></i>
            </div>
            <h3 className="font-heading text-xl font-extrabold text-white">Acesso à Carteira</h3>
            <p className="text-xs text-slate-300">
              Conecte-se para visualizar seu saldo em tempo real, efetuar depósitos Pix e solicitar saques.
            </p>
            <button
              type="button"
              onClick={handleConfirmLogin}
              className="w-full bg-gradient-to-r from-emerald-500 to-brand-accent text-slate-950 font-black py-3.5 rounded-xl text-sm mt-2 cursor-pointer"
            >
              ENTRAR COMO APOSTADOR
            </button>
          </div>
        </div>
      )}
    </>
  );
}
