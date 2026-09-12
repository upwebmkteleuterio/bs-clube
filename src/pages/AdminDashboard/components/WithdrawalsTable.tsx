import React from 'react';
import { AdminWithdrawal } from '../../../types';

interface WithdrawalsTableProps {
  withdrawals: AdminWithdrawal[];
  isLoading: boolean;
  onSelectWithdrawal: (withdrawal: AdminWithdrawal) => void;
}

export default function WithdrawalsTable({
  withdrawals,
  isLoading,
  onSelectWithdrawal,
}: WithdrawalsTableProps) {
  const formatCurrency = (val: number) =>
    `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
          <i className="fa-solid fa-money-bill-transfer text-emerald-400"></i>
          <span>Solicitações de Saque Pendentes</span>
          <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold ml-2">
            {withdrawals.length}
          </span>
        </h3>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="p-4">ID</th>
                <th className="p-4">Apostador</th>
                <th className="p-4">Data/Hora</th>
                <th className="p-4">Chave Pix</th>
                <th className="p-4 text-right">Valor (R$)</th>
                <th className="p-4 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    <i className="fa-solid fa-circle-notch fa-spin text-emerald-400 text-base mr-2"></i>
                    Carregando solicitações de saque...
                  </td>
                </tr>
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500">
                        <i className="fa-solid fa-check text-lg"></i>
                      </div>
                      <span className="text-slate-300 font-medium">Nenhum saque pendente no momento.</span>
                      <span className="text-[11px] text-slate-500">Todas as solicitações de resgate foram processadas com sucesso.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 text-slate-400 font-mono text-[11px] font-semibold">{w.id}</td>
                    <td className="p-4 font-bold text-white flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">
                        <i className="fa-solid fa-user"></i>
                      </div>
                      <span>{w.user}</span>
                    </td>
                    <td className="p-4 text-slate-400 text-xs">{w.date}</td>
                    <td className="p-4 text-slate-300 text-xs">
                      <div className="flex items-center space-x-1.5">
                        <i className="fa-brands fa-pix text-brand-pix text-[11px]"></i>
                        <span>{w.pixKey}</span>
                        <span className="bg-slate-800 text-slate-400 text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold">
                          {w.pixType}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-bold text-emerald-400 font-mono">
                      {formatCurrency(w.amount)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => onSelectWithdrawal(w)}
                        className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                      >
                        Analisar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
