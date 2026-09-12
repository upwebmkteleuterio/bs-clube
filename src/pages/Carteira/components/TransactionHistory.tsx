import React, { useState } from 'react';
import { UserTransaction } from '../../../types';

interface TransactionHistoryProps {
  transactions: UserTransaction[];
  isLoading: boolean;
  onSelectTransaction: (tx: UserTransaction) => void;
}

export default function TransactionHistory({
  transactions,
  isLoading,
  onSelectTransaction,
}: TransactionHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'deposit' | 'prize' | 'bet' | 'withdraw'>('all');

  const formatCurrency = (val: number) =>
    `R$ ${Math.abs(val).toFixed(2).replace('.', ',')}`;

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center space-x-2">
          <h3 className="font-heading text-lg font-bold text-white">Extrato Recente</h3>
          <span className="text-xs text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
            {transactions.length} registros
          </span>
        </div>

        {/* Filter chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              filter === 'all'
                ? 'bg-slate-800 text-emerald-400 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setFilter('deposit')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              filter === 'deposit'
                ? 'bg-slate-800 text-teal-400 font-bold border border-teal-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Depósitos
          </button>
          <button
            type="button"
            onClick={() => setFilter('prize')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              filter === 'prize'
                ? 'bg-slate-800 text-amber-400 font-bold border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Prêmios
          </button>
          <button
            type="button"
            onClick={() => setFilter('bet')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              filter === 'bet'
                ? 'bg-slate-800 text-slate-200 font-bold border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Apostas
          </button>
          <button
            type="button"
            onClick={() => setFilter('withdraw')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              filter === 'withdraw'
                ? 'bg-slate-800 text-red-400 font-bold border border-red-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Saques
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800"></div>
                  <div className="space-y-1.5">
                    <div className="w-28 h-3.5 bg-slate-800 rounded"></div>
                    <div className="w-16 h-2.5 bg-slate-800/80 rounded"></div>
                  </div>
                </div>
                <div className="w-20 h-4 bg-slate-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto text-xl">
              <i className="fa-solid fa-receipt"></i>
            </div>
            <p className="text-xs text-slate-400">Nenhuma movimentação encontrada neste filtro.</p>
          </div>
        ) : (
          filteredTransactions.map((t, index) => {
            const isPositive = t.value > 0;
            let iconElement;
            if (t.type === 'deposit') {
              iconElement = (
                <div className="w-9 h-9 rounded-full bg-teal-500/10 text-brand-pix flex items-center justify-center border border-teal-500/20">
                  <i className="fa-solid fa-arrow-down text-xs"></i>
                </div>
              );
            } else if (t.type === 'prize') {
              iconElement = (
                <div className="w-9 h-9 rounded-full bg-amber-500/10 text-brand-gold flex items-center justify-center border border-amber-500/20">
                  <i className="fa-solid fa-trophy text-xs"></i>
                </div>
              );
            } else if (t.type === 'bet') {
              iconElement = (
                <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-700">
                  <i className="fa-solid fa-ticket text-xs"></i>
                </div>
              );
            } else {
              iconElement = (
                <div className="w-9 h-9 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
                  <i className="fa-solid fa-arrow-up text-xs"></i>
                </div>
              );
            }

            return (
              <div
                key={t.id}
                onClick={() => onSelectTransaction(t)}
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-900/60 transition ${
                  index !== 0 ? 'border-t border-slate-800' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {iconElement}
                  <div>
                    <p className="text-sm font-semibold text-white">{t.title}</p>
                    <span className="text-[10px] text-slate-500">{t.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-bold ${
                      isPositive ? 'text-emerald-400' : 'text-slate-300'
                    }`}
                  >
                    {isPositive ? '+' : '-'} {formatCurrency(t.value)}
                  </p>
                  <span className="text-[10px] text-emerald-500 font-medium">Aprovado</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
