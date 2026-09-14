import React from 'react';
import { AdminWithdrawal } from '../../../types';

interface WithdrawalAnalysisModalProps {
  withdrawal: AdminWithdrawal | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isProcessing: boolean;
}

export default function WithdrawalAnalysisModal({
  withdrawal,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isProcessing,
}: WithdrawalAnalysisModalProps) {
  if (!isOpen || !withdrawal) return null;

  const formatCurrency = (val: number) =>
    `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md rounded-3xl border border-slate-800 p-6 relative shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Fechar"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-brand-accent border border-emerald-500/20 flex items-center justify-center text-xl mx-auto mb-3 shadow-inner">
            <i className="fa-solid fa-file-invoice-dollar"></i>
          </div>
          <h3 className="font-heading text-xl font-bold text-white">Análise de Saque</h3>
          <p className="text-xs text-slate-400 mt-1">
            Validação de resgate e liquidação via Pix instantâneo.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/80 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">Valor Solicitado</span>
              <strong className="text-2xl font-black text-emerald-400 font-mono">
                {formatCurrency(withdrawal.amount)}
              </strong>
            </div>

            <div className="border-t border-slate-800/80 pt-3 flex justify-between items-center">
              <span className="text-slate-400 text-xs">Apostador</span>
              <strong className="text-slate-200 text-sm">{withdrawal.user}</strong>
            </div>

            <div className="border-t border-slate-800/80 pt-3 flex justify-between items-center">
              <span className="text-slate-400 text-xs">Data da Solicitação</span>
              <span className="text-slate-300 text-xs font-mono">{withdrawal.date}</span>
            </div>

            <div className="border-t border-slate-800/80 pt-3">
              <span className="text-slate-400 text-xs block mb-1.5">Destino (Chave Pix)</span>
              <div className="flex items-center space-x-2 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800">
                <i className="fa-brands fa-pix text-brand-pix text-sm"></i>
                <span className="text-slate-200 font-mono text-xs flex-1 truncate">
                  {withdrawal.pixKey}
                </span>
                <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded uppercase font-semibold">
                  {withdrawal.pixType}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onReject(withdrawal.id)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-rose-400 hover:text-rose-300 border border-slate-800 py-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <i className="fa-solid fa-xmark"></i>
              <span>Rejeitar</span>
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onApprove(withdrawal.id)}
              className={`w-full font-black py-3 rounded-xl text-xs transition flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed ${
                isProcessing
                  ? 'bg-slate-800 text-emerald-400'
                  : 'bg-gradient-to-r from-emerald-500 to-brand-accent hover:from-emerald-400 hover:to-emerald-500 text-slate-950 shadow-lg shadow-emerald-900/40'
              }`}
            >
              {isProcessing ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>LIQUIDANDO...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check-double"></i>
                  <span>APROVAR PIX</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
