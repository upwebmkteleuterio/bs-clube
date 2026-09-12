import React from 'react';
import { AdminCategory } from '../../../types';

interface CategoriesManagementTableProps {
  categories: AdminCategory[];
  isLoading: boolean;
  onOpenNewCategory: () => void;
}

export default function CategoriesManagementTable({
  categories,
  isLoading,
  onOpenNewCategory,
}: CategoriesManagementTableProps) {
  const formatCurrency = (val: number) =>
    `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h4 className="font-heading font-bold text-white text-base">Modalidades de Bolão</h4>
          <p className="text-xs text-slate-400">
            Gerencie os bolões disponíveis na vitrine e controle vagas e cotas.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenNewCategory}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/30 cursor-pointer"
        >
          <i className="fa-solid fa-plus text-xs"></i>
          <span>Nova Categoria</span>
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="p-4">Nome da Categoria</th>
                <th className="p-4 text-center">Valor da Cota</th>
                <th className="p-4 text-center">Vagas Preenchidas</th>
                <th className="p-4 text-center">Data do Sorteio</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                    <i className="fa-solid fa-circle-notch fa-spin text-emerald-400 text-base mr-2"></i>
                    Carregando categorias...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                    Nenhuma categoria cadastrada no momento.
                  </td>
                </tr>
              ) : (
                categories.map((c) => {
                  let statusBadge = null;
                  if (c.status === 'em_andamento') {
                    statusBadge = (
                      <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-500/20">
                        Em Andamento
                      </span>
                    );
                  } else if (c.status === 'concluido') {
                    statusBadge = (
                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
                        Concluído
                      </span>
                    );
                  } else {
                    statusBadge = (
                      <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-700">
                        Inativo
                      </span>
                    );
                  }
                  const progress = Math.min((c.filled / c.vagas) * 100, 100);

                  return (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-bold text-white flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <span>{c.name}</span>
                      </td>
                      <td className="p-4 text-center font-bold text-emerald-400 font-mono">
                        {formatCurrency(c.cota)}
                      </td>
                      <td className="p-4 text-center text-slate-300">
                        <div className="flex flex-col items-center justify-center w-28 mx-auto">
                          <span className="text-xs font-bold font-mono">
                            {c.filled} <span className="text-slate-500 font-normal">/ {c.vagas}</span>
                          </span>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-brand-accent rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center text-slate-300 text-xs font-mono">
                        {c.drawDate}
                      </td>
                      <td className="p-4 text-center">{statusBadge}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
