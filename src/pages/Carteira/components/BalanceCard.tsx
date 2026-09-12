import React from 'react';
import { WalletBalance } from '../../../types';

interface BalanceCardProps {
  balance: WalletBalance | undefined;
  isLoading: boolean;
  isBalanceVisible: boolean;
  onToggleBalanceVisibility: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

export default function BalanceCard({
  balance,
  isLoading,
  isBalanceVisible,
  onToggleBalanceVisibility,
  onOpenDeposit,
  onOpenWithdraw,
}: BalanceCardProps) {
  const formatCurrency = (val: number) =>
    `R$ ${Math.abs(val).toFixed(2).replace('.', ',')}`;

  const total = balance?.total ?? 0;
  const withdrawable = balance?.withdrawable ?? 0;
  const bonus = balance?.bonus ?? 0;

  return (
    <section className="glass-card rounded-3xl p-5 sm:p-6 border border-brand-accent/30 shadow-2xl shadow-emerald-900/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
            Saldo Total
          </span>
          <div className="flex items-center space-x-3">
            {isLoading ? (
              <div className="h-10 w-44 bg-slate-800 animate-pulse rounded-lg"></div>
            ) : (
              <h2 className="font-heading text-4xl sm:text-5xl font-black text-white">
                {isBalanceVisible ? formatCurrency(total) : 'R$ ••••'}
              </h2>
            )}
            <button
              type="button"
              onClick={onToggleBalanceVisibility}
              aria-label={isBalanceVisible ? 'Ocultar saldo' : 'Exibir saldo'}
              className="text-slate-500 hover:text-slate-300 transition p-1 cursor-pointer"
            >
              <i className={`fa-solid ${isBalanceVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <span className="text-[10px] text-slate-400 block mb-0.5">
            <i className="fa-solid fa-money-bill-transfer mr-1"></i>Saldo Sacável
          </span>
          {isLoading ? (
            <div className="h-5 w-20 bg-slate-800 animate-pulse rounded"></div>
          ) : (
            <strong className="text-emerald-400 text-sm sm:text-base font-bold">
              {isBalanceVisible ? formatCurrency(withdrawable) : 'R$ ••••'}
            </strong>
          )}
        </div>
        <div className="border-l border-slate-800 pl-4">
          <span className="text-[10px] text-slate-400 block mb-0.5">
            <i className="fa-solid fa-gift mr-1"></i>Saldo de Bônus
          </span>
          {isLoading ? (
            <div className="h-5 w-20 bg-slate-800 animate-pulse rounded"></div>
          ) : (
            <strong className="text-amber-400 text-sm sm:text-base font-bold">
              {isBalanceVisible ? formatCurrency(bonus) : 'R$ ••••'}
            </strong>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <button
          type="button"
          onClick={onOpenDeposit}
          className="bg-gradient-to-r from-emerald-500 to-brand-accent hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black py-3 sm:py-3.5 px-2 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
        >
          <i className="fa-solid fa-circle-plus"></i>
          <span>DEPOSITAR</span>
        </button>
        <button
          type="button"
          onClick={onOpenWithdraw}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold py-3 sm:py-3.5 px-2 rounded-xl text-xs sm:text-sm transition flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
        >
          <i className="fa-solid fa-money-bill-wave text-slate-400"></i>
          <span>SACAR</span>
        </button>
      </div>
    </section>
  );
}
