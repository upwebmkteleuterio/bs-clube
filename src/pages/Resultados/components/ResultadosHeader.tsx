import React from 'react';

export default function ResultadosHeader({
  onOpenNotifications,
}: {
  onOpenNotifications: () => void;
}) {
  return (
    <header className="w-full glass-header sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-brand-gold flex items-center justify-center text-slate-900 font-bold shadow-md shadow-amber-900/50 text-lg">
            <i className="fa-solid fa-trophy"></i>
          </div>
          <div>
            <h1 className="font-heading font-black text-xl text-white leading-none">Resultados</h1>
            <span className="text-[10px] text-slate-400 font-medium">
              Sorteios e Ranking ao vivo
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenNotifications}
          aria-label="Notificações"
          className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition relative cursor-pointer"
        >
          <i className="fa-regular fa-bell"></i>
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand-accent rounded-full border-2 border-slate-900"></span>
        </button>
      </div>
    </header>
  );
}
