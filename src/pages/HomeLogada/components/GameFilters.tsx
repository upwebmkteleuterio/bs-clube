import React from 'react';
import { FilterCategory } from '../hooks/useHomeLobby';
import { Quota } from '../../../types';

interface GameFiltersProps {
  filterState: FilterCategory;
  setFilterState: (cat: FilterCategory) => void;
  authMode: 'guest' | 'auth';
  subscribedCount: number;
  quotas: Quota[];
}

export default function GameFilters({ filterState, setFilterState, authMode, subscribedCount, quotas }: GameFiltersProps) {
  const buttonClass = (active: boolean) => `px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap transition cursor-pointer ${active ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`;
  return (
    <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 w-full sm:w-auto overflow-x-auto hide-scrollbar">
      <button type="button" onClick={() => setFilterState('todos')} className={buttonClass(filterState === 'todos')}>Todos</button>
      <button type="button" onClick={() => setFilterState('meus')} className={`${buttonClass(filterState === 'meus')} flex items-center space-x-1.5`}>
        <span>Meus Jogos</span>
        {authMode === 'auth' && subscribedCount > 0 && <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${filterState === 'meus' ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{subscribedCount}</span>}
      </button>
      {quotas.map((quota) => (
        <button key={quota.id} type="button" onClick={() => setFilterState(quota.id)} className={buttonClass(filterState === quota.id)}>
          {quota.name || `Cota R$ ${quota.amount.toFixed(2).replace('.', ',')}`}
        </button>
      ))}
    </div>
  );
}
