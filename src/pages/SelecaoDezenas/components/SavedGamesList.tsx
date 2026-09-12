import React from 'react';

export interface SavedBetItem {
  id: string;
  numbers: number[];
}

interface SavedGamesListProps {
  savedGames: SavedBetItem[];
  onRemoveGame: (id: string) => void;
  onClearAllGames: () => void;
}

export default function SavedGamesList({
  savedGames,
  onRemoveGame,
  onClearAllGames,
}: SavedGamesListProps) {
  if (savedGames.length === 0) return null;

  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
      <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <h4 className="font-heading font-black text-white text-base">
            Seus Jogos Selecionados ({savedGames.length})
          </h4>
        </div>
        <button
          type="button"
          onClick={onClearAllGames}
          className="text-xs text-red-400 hover:text-red-300 font-semibold transition flex items-center space-x-1 cursor-pointer"
        >
          <i className="fa-solid fa-trash-arrow-up"></i>
          <span>Limpar todos os jogos</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
        {savedGames.map((game, index) => (
          <div
            key={game.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex justify-between items-center transition group"
          >
            <div className="flex items-center space-x-3">
              <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-950 px-2 py-1 rounded">
                #{String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex space-x-1">
                {game.numbers.map((n) => (
                  <span
                    key={n}
                    className="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold flex items-center justify-center font-mono"
                  >
                    {n.toString().padStart(2, '0')}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRemoveGame(game.id)}
              className="text-slate-500 hover:text-red-400 w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center transition cursor-pointer"
              title="Remover jogo"
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
