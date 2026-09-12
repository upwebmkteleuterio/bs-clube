import React, { useState } from 'react';
import { Game } from '../../../types';

interface RankingSearchAndSelectProps {
  games: Game[];
  selectedGameId: string;
  onSelectGame: (gameId: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function RankingSearchAndSelect({
  games,
  selectedGameId,
  onSelectGame,
  searchTerm,
  onSearchChange,
}: RankingSearchAndSelectProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedGame = games.find((g) => g.id === selectedGameId);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-4 bg-brand-gold rounded-full"></div>
          <h2 className="font-heading text-lg font-bold text-white">Ranking do Bolão</h2>
        </div>

        {/* Dynamic Bolão Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl px-3.5 py-2 flex items-center justify-between min-w-[220px] transition cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-layer-group text-brand-gold text-xs"></i>
              <span className="text-xs font-bold text-brand-gold">
                {selectedGame ? selectedGame.nome : 'Selecione o Bolão'}
              </span>
            </div>
            <i
              className={`fa-solid fa-chevron-down text-slate-500 text-[10px] transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            ></i>
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsDropdownOpen(false)}
              ></div>
              <div className="absolute right-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-30 space-y-1">
                <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-500">
                  Bolões Disponíveis
                </div>
                {games.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      onSelectGame(g.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                      g.id === selectedGameId
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{g.nome}</span>
                    <span className="text-[10px] text-brand-gold font-bold ml-2">
                      R$ {g.buyIn}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Participant Search Input */}
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Procurar participante por nome..."
          className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent transition shadow-inner"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>
    </div>
  );
}
