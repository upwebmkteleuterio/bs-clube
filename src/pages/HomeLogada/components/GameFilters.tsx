import React from 'react';
import { FilterCategory } from '../hooks/useHomeLobby';

interface GameFiltersProps {
  filterState: FilterCategory;
  setFilterState: (cat: FilterCategory) => void;
  authMode: 'guest' | 'auth';
  subscribedCount: number;
}

export default function GameFilters({
  filterState,
  setFilterState,
  authMode,
  subscribedCount,
}: GameFiltersProps) {
  return (
    <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 w-full sm:w-auto overflow-x-auto hide-scrollbar">
      <button
        type="button"
        onClick={() => setFilterState('todos')}
        className={`px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap transition cursor-pointer ${
          filterState === 'todos'
            ? 'bg-emerald-500 text-slate-950 shadow-sm'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        Todos
      </button>

      <button
        type="button"
        onClick={() => setFilterState('meus')}
        className={`px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap transition flex items-center space-x-1.5 cursor-pointer ${
          filterState === 'meus'
            ? 'bg-emerald-500 text-slate-950 shadow-sm'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <span>Meus Jogos</span>
        {authMode === 'auth' && subscribedCount > 0 && (
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              filterState === 'meus'
                ? 'bg-slate-950 text-emerald-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}
          >
            {subscribedCount}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => setFilterState('cota10')}
        className={`px-4 py-2 rounded-lg font-semibold text-xs whitespace-nowrap transition cursor-pointer ${
          filterState === 'cota10'
            ? 'bg-emerald-500 text-slate-950 font-bold'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        Cota R$ 10
      </button>

      <button
        type="button"
        onClick={() => setFilterState('cota20')}
        className={`px-4 py-2 rounded-lg font-semibold text-xs whitespace-nowrap transition cursor-pointer ${
          filterState === 'cota20'
            ? 'bg-emerald-500 text-slate-950 font-bold'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        Cota R$ 20
      </button>

      <button
        type="button"
        onClick={() => setFilterState('cota50')}
        className={`px-4 py-2 rounded-lg font-semibold text-xs whitespace-nowrap transition cursor-pointer ${
          filterState === 'cota50'
            ? 'bg-emerald-500 text-slate-950 font-bold'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        Cota R$ 50+
      </button>
    </div>
  );
}
