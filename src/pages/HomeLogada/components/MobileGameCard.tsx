import React from 'react';
import { Game } from '../../../types';

interface MobileGameCardProps {
  key?: React.Key;
  game: Game;
  isSubscribed: boolean;
  onPlayAction: (gameId?: string) => void;
}

export default function MobileGameCard({
  game,
  isSubscribed,
  onPlayAction,
}: MobileGameCardProps) {
  const percentFilled = Math.min(
    100,
    Math.round((game.inscritosAtuais / game.inscritosMax) * 100)
  );

  return (
    <div
      onClick={() => onPlayAction(game.id)}
      className={`p-3.5 space-y-2.5 transition-all cursor-pointer ${
        isSubscribed
          ? 'bg-emerald-950/40 border-l-4 border-l-emerald-500 shadow-inner'
          : 'hover:bg-slate-900/60'
      }`}
    >
      {/* Top row: Icon + Name + Badge Playing + State */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
              isSubscribed
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <i className="fa-solid fa-dice"></i>
          </div>
          <div className="truncate">
            <span
              className={`text-xs block truncate ${
                isSubscribed ? 'text-white font-black' : 'text-slate-200 font-bold'
              }`}
            >
              {game.nome}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 shrink-0">
          {isSubscribed && (
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Jogando
            </span>
          )}
          <span
            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider inline-flex items-center space-x-1 ${
              game.estado === 'Aberto'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : game.estado === 'Reg. Tardio'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                game.estado === 'Aberto' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            ></span>
            <span>{game.estado}</span>
          </span>
        </div>
      </div>

      {/* Center row: Info grid */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-900/80 border border-slate-800/80 rounded-xl p-2 text-center text-[10px]">
        <div>
          <span className="text-slate-500 text-[9px] block uppercase font-medium">Buy-in</span>
          <span className="text-emerald-400 font-bold whitespace-nowrap">
            R$ {game.buyIn.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <div>
          <span className="text-slate-500 text-[9px] block uppercase font-medium">Prêmio</span>
          <span className="text-brand-gold font-black whitespace-nowrap">
            R$ {game.premio.toLocaleString('pt-BR')}
          </span>
        </div>
        <div>
          <span className="text-slate-500 text-[9px] block uppercase font-medium">Regras</span>
          <span className="text-slate-300 font-medium truncate block">{game.tipo}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[9px] block uppercase font-medium">Velocidade</span>
          <span className="text-slate-300 font-medium truncate block">{game.velocidade}</span>
        </div>
      </div>

      {/* Bottom row: Progress + Action button */}
      <div className="flex items-center justify-between gap-3 pt-0.5">
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-400">
              {game.inscritosAtuais}/{game.inscritosMax} cotas
            </span>
            <span className="text-emerald-400 font-bold">{percentFilled}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isSubscribed ? 'bg-emerald-400' : 'bg-emerald-500'
              }`}
              style={{ width: `${percentFilled}%` }}
            ></div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlayAction(game.id);
          }}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold shrink-0 transition flex items-center space-x-1 cursor-pointer ${
            isSubscribed
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-800 text-slate-200 border border-slate-700'
          }`}
        >
          <span>{isSubscribed ? 'Ver Jogo' : 'Participar'}</span>
          <i className="fa-solid fa-chevron-right text-[8px]"></i>
        </button>
      </div>
    </div>
  );
}
