import React from 'react';
import { BolaoDetails } from '../../../types';

interface BolaoInfoCardProps {
  bolao: BolaoDetails | undefined;
  isLoading: boolean;
}

export default function BolaoInfoCard({ bolao, isLoading }: BolaoInfoCardProps) {
  if (isLoading) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-5 sm:p-6 animate-pulse space-y-4">
        <div className="h-6 w-32 bg-slate-800 rounded"></div>
        <div className="h-8 w-64 bg-slate-800 rounded"></div>
        <div className="h-4 w-48 bg-slate-800/70 rounded"></div>
      </div>
    );
  }

  const title = bolao?.nome || 'Sorteio BIG 10';
  const mesaName = bolao?.mesaName || 'Mesa Ativa #01';
  const schedule = bolao ? `Sorteio ${bolao.dataSorteio} ${bolao.horarioSorteio}` : 'Sorteio Sábado 20h';
  const cotaPrice = bolao?.cotaPrice ?? 10;
  const vagas = bolao?.vagasPreenchidas ?? 12;
  const vagasTotal = bolao?.vagasTotal ?? 100;
  const description = bolao?.descricao || 'Marque 6 dezenas ou gere múltiplos jogos nesta mesma tela para concorrer.';

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-xl">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5 relative z-10">
        <div>
          <div className="flex items-center space-x-2 mb-2 text-[10px]">
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {mesaName}
            </span>
            <span className="text-slate-400">{schedule}</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">{title}</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">{description}</p>
        </div>

        <div className="sm:text-right bg-slate-950 sm:bg-transparent border border-slate-800 sm:border-none p-3 sm:p-0 rounded-xl">
          <span className="text-[10px] text-slate-500 font-medium mb-1 block">Valor por Cota</span>
          <div className="sm:bg-slate-950 sm:border border-slate-800 rounded-lg sm:px-3 sm:py-2 flex items-center justify-between sm:min-w-[150px]">
            <span className="font-bold text-emerald-400 text-sm sm:text-base">
              R$ {cotaPrice.toFixed(2).replace('.', ',')}{' '}
              <span className="text-xs font-normal text-slate-500">({title})</span>
            </span>
            <i className="fa-solid fa-chevron-down text-slate-600 text-[10px] ml-2 hidden sm:inline"></i>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 relative z-10">
        <div className="flex items-center space-x-2 text-xs">
          <i className="fa-solid fa-users text-emerald-500"></i>
          <span className="text-slate-400 hidden sm:inline">Vagas Preenchidas:</span>
          <span className="text-white font-bold">
            {vagas}/{vagasTotal} cotas
          </span>
        </div>
        <span className="text-amber-500 text-[10px] font-bold uppercase tracking-wider flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span> Mesa Aberta
        </span>
      </div>
    </div>
  );
}
