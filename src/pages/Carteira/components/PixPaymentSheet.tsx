import React, { useState } from 'react';

interface PixPaymentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  depositAmount: string;
  pixTimer: number;
  pixCode?: string;
}

export default function PixPaymentSheet({
  isOpen,
  onClose,
  depositAmount,
  pixTimer,
  pixCode,
}: PixPaymentSheetProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (pixCode && navigator.clipboard) {
      navigator.clipboard.writeText(pixCode);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const minutes = String(Math.floor(pixTimer / 60)).padStart(2, '0');
  const seconds = String(pixTimer % 60).padStart(2, '0');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[95vh] overflow-y-auto">
        <div className="text-center border-b border-slate-800 pb-4 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute -top-2 right-0 text-slate-400 hover:text-white p-2 cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
          <span className="text-xs text-brand-pix font-bold uppercase tracking-wider block mb-1">
            Pix Copia e Cola
          </span>
          <h4 className="font-heading font-black text-2xl text-white">
            R$ <span>{parseFloat(depositAmount || '0').toFixed(2).replace('.', ',')}</span>
          </h4>
        </div>

        <div className="bg-white p-3 rounded-3xl w-56 h-56 mx-auto flex items-center justify-center border-4 border-teal-500/20 pix-waiting relative">
          {pixCode ? (
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}`}
              alt="QR Code Pix"
              className="w-full h-full opacity-90"
            />
          ) : (
            <span className="text-center text-xs font-semibold text-slate-500">QR Code indisponível</span>
          )}
          <div className="absolute -bottom-3 bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-xs font-mono text-slate-300 flex items-center space-x-1.5 shadow-lg">
            <i className="fa-regular fa-clock text-brand-pix"></i>
            <span>
              {minutes}:{seconds}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center px-4">
          Abra o app do seu banco, escolha <strong>Pix Copia e Cola</strong> ou escaneie o código acima.
        </p>

        <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <input
            type="text"
            readOnly
            value={pixCode ?? ''}
            aria-label="Código Pix"
            className="bg-transparent text-xs text-slate-400 w-full pl-3 focus:outline-none truncate font-mono"
          />
          <button
            type="button"
            onClick={handleCopy}
            disabled={!pixCode}
            className="bg-slate-800 hover:bg-slate-700 text-brand-pix px-4 py-2.5 rounded-lg text-xs font-bold flex-shrink-0 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>

        <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-3 flex flex-col items-center justify-center text-center space-y-2 mt-2">
          <i className="fa-solid fa-circle-notch fa-spin text-brand-pix text-xl"></i>
          <span className="text-xs text-slate-300 font-medium">
            Aguardando confirmação de pagamento...
          </span>
          <span className="text-[10px] text-slate-500">
            O saldo só será liberado após a confirmação do provedor.
          </span>
        </div>
      </div>
    </div>
  );
}
