import React, { useState } from 'react';

export default function CarteiraHeader() {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <header className="w-full glass-header sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-brand-accent flex items-center justify-center text-white font-bold shadow-md shadow-emerald-900/50 text-lg">
              <i className="fa-solid fa-wallet"></i>
            </div>
            <div>
              <h1 className="font-heading font-black text-xl text-white leading-none">Minha Carteira</h1>
              <span className="text-[10px] text-slate-400 font-medium">Gestão Financeira & Prêmios</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowHelp(true)}
            aria-label="Central de Ajuda"
            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
          >
            <i className="fa-solid fa-circle-question"></i>
          </button>
        </div>
      </header>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-sm rounded-3xl border border-slate-700 p-6 space-y-4 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-bold text-white text-base flex items-center space-x-2">
                <i className="fa-solid fa-shield-halved text-emerald-400"></i>
                <span>Ajuda Financeira</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="text-slate-400 hover:text-white w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <p>
                <strong className="text-white">Depósitos via Pix:</strong> São compensados de forma instantânea através da nossa integração segura.
              </p>
              <p>
                <strong className="text-white">Saques de Prêmios:</strong> Podem ser solicitados a qualquer momento para chaves Pix no mesmo CPF cadastrado.
              </p>
              <p>
                <strong className="text-white">Saldo de Bônus:</strong> Disponível para novas apostas em qualquer bolão ativo da plataforma.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}
