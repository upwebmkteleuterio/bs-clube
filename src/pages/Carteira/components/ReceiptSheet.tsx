import React from 'react';
import { UserTransaction } from '../../../types';

interface ReceiptSheetProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: UserTransaction | null;
}

export default function ReceiptSheet({
  isOpen,
  onClose,
  transaction,
}: ReceiptSheetProps) {
  if (!isOpen || !transaction) return null;

  const formatCurrency = (val: number) =>
    `R$ ${Math.abs(val).toFixed(2).replace('.', ',')}`;

  const isDeposit = transaction.type === 'deposit';
  const isWithdraw = transaction.type === 'withdraw';
  const isPrize = transaction.type === 'prize';
  const pixKeyTypeLabel: Record<string, string> = {
    cpf: 'CPF',
    email: 'E-mail',
    phone: 'Telefone',
    random: 'Chave aleatória',
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto -mt-2 mb-4 sm:hidden"></div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="text-center border-b border-slate-800 pb-4">
          {isDeposit && (
            <div className="w-14 h-14 rounded-full bg-teal-500/10 text-brand-pix border border-teal-500/20 flex items-center justify-center text-2xl mx-auto mb-3">
              <i className="fa-solid fa-arrow-down"></i>
            </div>
          )}
          {isWithdraw && (
            <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center text-2xl mx-auto mb-3">
              <i className="fa-solid fa-arrow-up"></i>
            </div>
          )}
          {isPrize && (
            <div className="w-14 h-14 rounded-full bg-amber-500/10 text-brand-gold border border-amber-500/20 flex items-center justify-center text-2xl mx-auto mb-3">
              <i className="fa-solid fa-trophy"></i>
            </div>
          )}
          {!isDeposit && !isWithdraw && !isPrize && (
            <div className="w-14 h-14 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center text-2xl mx-auto mb-3">
              <i className="fa-solid fa-receipt"></i>
            </div>
          )}

          <h4
            className={`font-heading font-black text-2xl ${
              transaction.value > 0 ? 'text-emerald-400' : 'text-white'
            }`}
          >
            {transaction.value > 0 ? '+' : '-'} {formatCurrency(transaction.value)}
          </h4>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            {transaction.title}
          </span>
        </div>

        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Status:</span>
            <strong className="text-emerald-400 flex items-center space-x-1">
              <i className="fa-solid fa-circle-check text-[10px]"></i>
              <span>Aprovado</span>
            </strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Data e Hora:</span>
            <strong className="text-slate-200">{transaction.date}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Método:</span>
            <strong className="text-slate-200">
              {transaction.type === 'bet' ? 'Saldo da Carteira' : 'Pix Instantâneo'}
            </strong>
          </div>
          {isWithdraw && transaction.pixKeyType && (
            <div className="flex justify-between">
              <span className="text-slate-400">Tipo da Chave Pix:</span>
              <strong className="text-slate-200">{pixKeyTypeLabel[transaction.pixKeyType] ?? transaction.pixKeyType}</strong>
            </div>
          )}
          {isWithdraw && transaction.pixKey && (
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Chave Pix:</span>
              <strong className="break-all text-right text-slate-200">{transaction.pixKey}</strong>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-800 pt-3 mt-1">
            <span className="text-slate-500">ID da Transação:</span>
            <span className="text-slate-500 font-mono text-[10px]">#{transaction.id}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl text-sm transition cursor-pointer"
        >
          Fechar Comprovante
        </button>
      </div>
    </div>
  );
}
