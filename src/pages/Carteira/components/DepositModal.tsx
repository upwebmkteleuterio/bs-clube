import React from 'react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  depositAmount: string;
  onDepositAmountChange: (val: string) => void;
  onQuickAdd: (val: number) => void;
  onGeneratePix: () => void;
}

export default function DepositModal({
  isOpen,
  onClose,
  depositAmount,
  onDepositAmountChange,
  onQuickAdd,
  onGeneratePix,
}: DepositModalProps) {
  if (!isOpen) return null;

  const numVal = parseFloat(depositAmount) || 0;
  const isValid = numVal >= 5 && numVal <= 5000;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto -mt-2 mb-2 sm:hidden"></div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-5 right-5 text-slate-400 hover:text-white w-8 h-8 rounded-full bg-slate-800 border border-slate-700 hidden sm:flex items-center justify-center cursor-pointer"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 text-slate-400 hover:text-white sm:hidden"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-brand-pix border border-teal-500/20 flex items-center justify-center text-2xl mx-auto">
            <i className="fa-brands fa-pix"></i>
          </div>
          <h3 className="font-heading text-2xl font-black text-white">Adicionar Saldo</h3>
          <p className="text-xs text-slate-400">Depósito instantâneo via Pix. Livre de taxas.</p>
        </div>

        <div className="space-y-4 pt-2">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => onDepositAmountChange(e.target.value)}
              placeholder="0,00"
              step="1.00"
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-2xl font-black text-white focus:outline-none focus:border-brand-pix focus:ring-1 focus:ring-brand-pix transition text-center"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => onQuickAdd(10)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl text-xs border border-slate-700 transition cursor-pointer"
            >
              +10
            </button>
            <button
              type="button"
              onClick={() => onQuickAdd(20)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl text-xs border border-slate-700 transition cursor-pointer"
            >
              +20
            </button>
            <button
              type="button"
              onClick={() => onQuickAdd(50)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl text-xs border border-slate-700 transition cursor-pointer"
            >
              +50
            </button>
            <button
              type="button"
              onClick={() => onQuickAdd(100)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl text-xs border border-slate-700 transition cursor-pointer"
            >
              +100
            </button>
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 px-1">
            <span>Mínimo: R$ 5,00</span>
            <span>Máximo: R$ 5.000,00</span>
          </div>

          <button
            type="button"
            disabled={!isValid}
            onClick={onGeneratePix}
            className={`w-full font-black py-4 rounded-xl text-sm transition-all mt-4 flex justify-center items-center space-x-2 cursor-pointer ${
              isValid
                ? 'bg-gradient-to-r from-teal-400 to-brand-pix hover:from-teal-300 hover:to-teal-400 text-slate-950 shadow-lg shadow-teal-900/40 transform hover:-translate-y-0.5'
                : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
            }`}
          >
            <i className="fa-solid fa-qrcode"></i>
            <span>GERAR QR CODE PIX</span>
          </button>
        </div>
      </div>
    </div>
  );
}
