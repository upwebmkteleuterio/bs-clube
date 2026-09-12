import React from 'react';
import { OfficialDraw } from '../../../types';

interface OfficialDrawsCarouselProps {
  draws: OfficialDraw[];
  activeDrawId: string;
  onSelectDraw: (drawId: string) => void;
  isLoading?: boolean;
}

export default function OfficialDrawsCarousel({
  draws,
  activeDrawId,
  onSelectDraw,
  isLoading,
}: OfficialDrawsCarouselProps) {
  if (isLoading) {
    return (
      <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-2 animate-pulse">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="min-w-[300px] h-36 bg-slate-900/60 border border-slate-800 rounded-3xl p-5"
          >
            <div className="w-24 h-4 bg-slate-800 rounded mb-3"></div>
            <div className="flex justify-between mt-6">
              {[1, 2, 3, 4, 5, 6].map((b) => (
                <div key={b} className="w-8 h-8 rounded-full bg-slate-800"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-2 snap-x">
      {draws.map((draw) => {
        const isActive = activeDrawId === draw.id || (!activeDrawId && draws[0]?.id === draw.id);

        return (
          <div
            key={draw.id}
            onClick={() => onSelectDraw(draw.id)}
            className={`min-w-[300px] p-5 rounded-3xl snap-center relative overflow-hidden cursor-pointer transition-all duration-300 ${
              isActive
                ? 'glass-card border-emerald-500/40 shadow-lg shadow-emerald-950/30'
                : 'glass-card border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
            }`}
          >
            {isActive && (
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            )}

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <div className="flex items-center space-x-1.5 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-block ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {draw.concurso}
                  </span>
                  {isActive && (
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                      Ativo
                    </span>
                  )}
                </div>
                <div className="text-white font-bold text-sm">
                  <i className="fa-solid fa-calendar-day text-slate-400 mr-1.5"></i>
                  {draw.data}
                </div>
              </div>
              <div className="text-right text-[10px] text-slate-400">
                <i className="fa-solid fa-location-dot mr-1 text-red-400"></i>
                {draw.local}
              </div>
            </div>

            <div className="flex justify-between items-center relative z-10">
              {draw.dezenas.map((n) => (
                <div
                  key={n}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-transform ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-emerald-900/40 scale-105'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  {n.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
