import React from 'react';

interface NumberGridProps {
  selectedNumbers: number[];
  onToggleNumber: (num: number) => void;
  onGenerateSurpresinha: () => void;
  onAddSurpresinhasBulk: (count: number) => void;
  onClearCurrentSelection: () => void;
  onAddCurrentGame: () => void;
  totalBalls?: number;
  requiredNumbers?: number;
}

export default function NumberGrid({
  selectedNumbers,
  onToggleNumber,
  onGenerateSurpresinha,
  onAddSurpresinhasBulk,
  onClearCurrentSelection,
  onAddCurrentGame,
  totalBalls = 60,
  requiredNumbers = 6,
}: NumberGridProps) {
  const isCardComplete = selectedNumbers.length === requiredNumbers;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-4">
        <div>
          <h3 className="font-heading text-lg font-black text-white uppercase tracking-wide flex items-center">
            Monte seu Jogo
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded ml-2 normal-case font-medium">
              {requiredNumbers} Dezenas (1 a {totalBalls})
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Toque no número para marcar ou gere surpresinhas automáticas
          </p>
        </div>

        {/* Ações de Surpresinha e Limpar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onGenerateSurpresinha}
            className="flex items-center space-x-1.5 border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            title="Gera 6 dezenas aleatórias na cartela atual"
          >
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <span>Surpresinha</span>
          </button>

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => onAddSurpresinhasBulk(1)}
              className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white font-semibold hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Gera e adiciona 1 jogo de surpresinha"
            >
              +1 Jogo
            </button>
            <button
              type="button"
              onClick={() => onAddSurpresinhasBulk(3)}
              className="px-2.5 py-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Gera e adiciona 3 jogos de surpresinha"
            >
              +3 Jogos
            </button>
            <button
              type="button"
              onClick={() => onAddSurpresinhasBulk(5)}
              className="px-2.5 py-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Gera e adiciona 5 jogos de surpresinha"
            >
              +5 Jogos
            </button>
          </div>

          <button
            type="button"
            onClick={onClearCurrentSelection}
            className="flex items-center space-x-1.5 border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer"
          >
            <i className="fa-solid fa-trash-can"></i>
            <span className="hidden sm:inline">Limpar</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-950/80 border border-slate-800/80 rounded-[2rem] p-5 sm:p-8 shadow-2xl shadow-black/40">
        <div className="grid grid-cols-6 sm:grid-cols-10 gap-x-2 gap-y-3 sm:gap-x-3 sm:gap-y-4 justify-items-center">
          {Array.from({ length: totalBalls }, (_, i) => i + 1).map((num) => {
            const isSelected = selectedNumbers.includes(num);
            return (
              <button
                type="button"
                key={num}
                onClick={() => onToggleNumber(num)}
                className={`lottery-ball cursor-pointer ${isSelected ? 'selected' : ''}`}
                aria-pressed={isSelected}
              >
                {num.toString().padStart(2, '0')}
              </button>
            );
          })}
        </div>

        {/* Ação rápida para adicionar o volante marcado aos jogos */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Cartela atual:</span>
            <div className="flex space-x-1.5">
              {Array.from({ length: requiredNumbers }, (_, i) => {
                const num = selectedNumbers[i];
                return num ? (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center shadow-md animate-scaleIn"
                  >
                    {num.toString().padStart(2, '0')}
                  </div>
                ) : (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] text-slate-600 font-mono"
                  >
                    --
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            disabled={!isCardComplete}
            onClick={onAddCurrentGame}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Adicionar este Jogo à Lista (+1 Cota)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
