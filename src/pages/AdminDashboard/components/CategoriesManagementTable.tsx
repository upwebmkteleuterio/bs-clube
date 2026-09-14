import React from 'react';
import { AdminCategory } from '../../../types';

interface CategoriesManagementTableProps {
  categories: AdminCategory[];
  isLoading: boolean;
  onOpenNewCategory: () => void;
  onEditCategory: (category: AdminCategory) => void;
  onRegisterResult: (category: AdminCategory) => void;
}

export default function CategoriesManagementTable({ categories, isLoading, onOpenNewCategory, onEditCategory, onRegisterResult }: CategoriesManagementTableProps) {
  const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h4 className="font-heading font-bold text-white text-base">Bolões</h4>
          <p className="text-xs text-slate-400">Gerencie os bolões disponíveis e registre seus resultados oficiais.</p>
        </div>
        <button type="button" onClick={onOpenNewCategory} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/30 cursor-pointer">
          <i className="fa-solid fa-plus text-xs"></i><span>Novo Bolão</span>
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead><tr className="bg-slate-900/60 border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              <th className="p-4">Nome do Bolão</th><th className="p-4 text-center">Concurso</th><th className="p-4 text-center">Cota</th><th className="p-4 text-center">Vagas</th><th className="p-4 text-center">Data</th><th className="p-4 text-center">Resultado</th><th className="p-4 text-center">Ações</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {isLoading ? <tr><td colSpan={7} className="p-8 text-center text-slate-400 text-xs"><i className="fa-solid fa-circle-notch fa-spin text-emerald-400 text-base mr-2"></i>Carregando bolões...</td></tr> : categories.length === 0 ? <tr><td colSpan={7} className="p-8 text-center text-slate-400 text-xs">Nenhum bolão cadastrado no momento.</td></tr> : categories.map((category) => {
                const progress = category.vagas > 0 ? Math.min((category.filled / category.vagas) * 100, 100) : 0;
                const completed = category.status === 'concluido';
                const inactive = category.status === 'inativo';
                return <tr key={category.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white"><div className="flex items-center space-x-2"><div className={`w-2 h-2 rounded-full ${completed ? 'bg-amber-400' : 'bg-emerald-400'}`}></div><span>{category.name}</span></div></td>
                  <td className="p-4 text-center text-slate-300 font-mono">#{category.concurso || '—'}</td>
                  <td className="p-4 text-center font-bold text-emerald-400 font-mono">{formatCurrency(category.cota)}</td>
                  <td className="p-4 text-center text-slate-300"><div className="flex flex-col items-center justify-center w-24 mx-auto"><span className="text-xs font-bold font-mono">{category.filled} <span className="text-slate-500 font-normal">/ {category.vagas}</span></span><div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-500 to-brand-accent rounded-full" style={{ width: `${progress}%` }}></div></div></div></td>
                  <td className="p-4 text-center text-slate-300 text-xs font-mono">{category.drawDate || '—'}</td>
                  <td className="p-4 text-center">{completed ? <div className="flex flex-col items-center gap-1"><span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">Concluído</span><div className="flex gap-0.5">{(category.numbers ?? []).map((number) => <span key={number} className="text-[9px] text-amber-300 font-mono">{String(number).padStart(2, '0')}</span>)}</div></div> : inactive ? <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-700">Inativo</span> : <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-500/20">Em andamento</span>}</td>
                  <td className="p-4"><div className="flex justify-center gap-2"><button type="button" onClick={() => onEditCategory(category)} className="px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-emerald-400 text-[10px] font-bold transition" aria-label={`Editar ${category.name}`}><i className="fa-solid fa-pen"></i></button>{!completed && <button type="button" onClick={() => onRegisterResult(category)} className="px-2.5 py-1.5 rounded-lg border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 text-[10px] font-bold transition">Registrar resultado</button>}</div></td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
