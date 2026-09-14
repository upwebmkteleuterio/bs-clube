import React from 'react';
import { Game } from '../../../types';

interface DesktopGameTableProps {
  games: Game[];
  authMode: 'guest' | 'auth';
  subscribedGames: string[];
  onPlayAction: (gameId?: string) => void;
}

export default function DesktopGameTable({
  games,
  authMode,
  subscribedGames,
  onPlayAction,
}: DesktopGameTableProps) {
  if (games.length === 0) {
    return (
      <div className="hidden md:block py-16 text-center text-slate-500">
        <i className="fa-solid fa-circle-exclamation text-3xl mb-3 block text-slate-600"></i>
        <p className="text-sm font-semibold text-slate-400">Nenhum bolão encontrado para este filtro.</p>
        <p className="text-xs text-slate-500 mt-1">Experimente alternar entre os filtros acima para ver outras opções disponíveis.</p>
      </div>
    );
  }

  return (
    <div className="hidden md:block overflow-x-auto hide-scrollbar">
      <table className="w-full text-left border-collapse min-w-[760px]">
        <thead>
          <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none">
            <th className="py-3.5 px-4">Jogo</th>
            <th className="py-3.5 px-4">Buy-In (Entrada)</th>
            <th className="py-3.5 px-4">Prêmio Estimado</th>
            <th className="py-3.5 px-4">Data do sorteio</th>
            <th className="py-3.5 px-4">Tipo</th>
            <th className="py-3.5 px-4">Estado</th>
            <th className="py-3.5 px-4">Inscritos</th>
            <th className="py-3.5 px-4 text-right">Ação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-xs">
          {games.map((game) => {
            const isSubscribed = authMode === 'auth' && subscribedGames.includes(game.id);
            const percentFilled = Math.min(
              100,
              Math.round((game.inscritosAtuais / game.inscritosMax) * 100)
            );

            return (
              <tr
                key={game.id}
                onClick={() => !game.isUnavailable && onPlayAction(game.id)}
                className={`transition-all group ${game.isUnavailable ? 'opacity-80' : 'cursor-pointer'} ${
                  isSubscribed
                    ? 'bg-emerald-950/40 hover:bg-emerald-950/60 border-l-4 border-l-emerald-500 font-bold text-white shadow-inner'
                    : 'hover:bg-slate-900/60 text-slate-300 font-normal'
                }`}
              >
                {/* Jogo / Nome */}
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 transition-colors ${
                        isSubscribed
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                          : 'bg-slate-800 text-slate-400 group-hover:text-white'
                      }`}
                    >
                      <i className="fa-solid fa-dice"></i>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`${
                            isSubscribed
                              ? 'text-white font-extrabold text-sm'
                              : 'text-slate-200 font-semibold'
                          }`}
                        >
                          {game.nome}
                        </span>
                        {isSubscribed && (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider inline-flex items-center space-x-1">
                            <i className="fa-solid fa-check text-[9px]"></i>
                            <span>Jogando</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Buy-In */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs ${
                      isSubscribed
                        ? 'bg-emerald-500/20 text-emerald-300 font-black'
                        : 'bg-slate-900 text-slate-300 font-semibold border border-slate-800'
                    }`}
                  >
                    R$ {game.buyIn.toFixed(2).replace('.', ',')}
                  </span>
                </td>

                {/* Prêmio */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="text-brand-gold font-black text-sm">
                    R$ {game.premio.toLocaleString('pt-BR')},00
                  </span>
                </td>

                {/* Data do sorteio */}
                <td className="py-4 px-4 whitespace-nowrap text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <i className="fa-regular fa-calendar text-[11px] text-slate-500"></i>
                    <span className={isSubscribed ? 'text-slate-200 font-semibold' : ''}>{game.dataEncerramento ? new Date(game.dataEncerramento).toLocaleDateString('pt-BR') : '—'}</span>
                  </div>
                </td>

                {/* Tipo */}
                <td className="py-4 px-4 whitespace-nowrap text-slate-400">
                  <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-300">
                    {game.tipo}
                  </span>
                </td>

                {/* Estado */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center space-x-1.5 ${
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
                </td>

                {/* Inscritos */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="w-28 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span
                        className={
                          isSubscribed ? 'text-emerald-400 font-bold' : 'text-slate-300 font-medium'
                        }
                      >
                        {game.inscritosAtuais} / {game.inscritosMax}
                      </span>
                      <span className="text-[10px] text-slate-500">{percentFilled}%</span>
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
                </td>

                {/* Ação */}
                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!game.isUnavailable) onPlayAction(game.id);
                      }}
                      disabled={game.isUnavailable}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition inline-flex items-center space-x-1.5 ${game.isUnavailable ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'cursor-pointer'} ${
                      isSubscribed
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/50'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    <span>{game.isUnavailable ? 'Indisponível' : isSubscribed ? 'Ver Jogo' : 'Participar'}</span>
                    <i className="fa-solid fa-chevron-right text-[10px]"></i>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
