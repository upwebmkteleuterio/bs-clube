import React from 'react';

interface BottomConfirmationBarProps {
  totalGamesCount: number;
  totalPrice: number;
  selectedNumbersCount: number;
  savedGamesCount: number;
  requiredNumbers: number;
  onConfirm: () => void;
}

export default function BottomConfirmationBar({
  totalGamesCount,
  totalPrice,
  selectedNumbersCount,
  savedGamesCount,
  requiredNumbers,
  onConfirm,
}: BottomConfirmationBarProps) {
  const getSubtitle = () => {
    if (totalGamesCount === 0) {
      return `Selecione ${requiredNumbers} dezenas ou gere surpresinhas para continuar`;
    }
    if (selectedNumbersCount === requiredNumbers) {
      return `${savedGamesCount} na lista + 1 no volante atual`;
    }
    return `${savedGamesCount} jogos salvos`;
  };

  return (
    <div className="fixed bottom-[68px] left-0 w-full bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-4 py-4 sm:px-6 z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400">Total de Jogos:</span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-black">
              {totalGamesCount} {totalGamesCount === 1 ? 'Jogo' : 'Jogos'}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Total:</span>
            <span className="font-heading font-black text-lg text-emerald-400">
              R$ {totalPrice.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1">{getSubtitle()}</span>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            type="button"
            disabled={totalGamesCount === 0}
            onClick={onConfirm}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 px-8 rounded-xl text-sm font-black transition flex justify-center items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:shadow-none transform active:scale-95 cursor-pointer"
          >
            <i className="fa-solid fa-check"></i>
            <span>CONFIRMAR JOGO</span>
          </button>
        </div>
      </div>
    </div>
  );
}
