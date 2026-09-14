import React from 'react';
import { AdminFinancialMetrics } from '../../../types';

interface MetricsOverviewProps {
  metrics?: AdminFinancialMetrics;
  isLoading: boolean;
}

export default function MetricsOverview({ metrics, isLoading }: MetricsOverviewProps) {
  const formatCurrency = (val: number) =>
    `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="glass-card rounded-2xl p-6 border border-slate-800 animate-pulse space-y-3"
          >
            <div className="h-4 bg-slate-800 rounded w-1/2"></div>
            <div className="h-8 bg-slate-800 rounded w-3/4"></div>
            <div className="h-3 bg-slate-800 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Total Arrecadado */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800/80 hover:border-slate-700 transition">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Arrecadado
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <i className="fa-solid fa-wallet"></i>
          </div>
        </div>
        <h3 className="font-heading text-2xl sm:text-3xl font-black text-white mb-1">
          {formatCurrency(metrics.totalArrecadado)}
        </h3>
        <p className="text-xs text-slate-400">Pagamentos confirmados no banco de dados</p>
      </div>

      {/* Lucro */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between mb-4 relative">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Lucro ({metrics.lucroPercent}%)
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <i className="fa-solid fa-piggy-bank"></i>
          </div>
        </div>
        <h3 className="font-heading text-2xl sm:text-3xl font-black text-emerald-400 mb-1 relative">
          {formatCurrency(metrics.lucroRetido)}
        </h3>
        <p className="text-xs text-slate-400 relative">Receita líquida retida</p>
      </div>

      {/* Prêmios Pagos */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800/80 hover:border-slate-700 transition">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Prêmios ({metrics.premiosPercent}%)
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-brand-gold flex items-center justify-center">
            <i className="fa-solid fa-trophy"></i>
          </div>
        </div>
        <h3 className="font-heading text-2xl sm:text-3xl font-black text-white mb-1">
          {formatCurrency(metrics.premiosPagos)}
        </h3>
        <p className="text-xs text-slate-400">Distribuído aos vencedores</p>
      </div>

      {/* Apostadores Ativos */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800/80 hover:border-slate-700 transition">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Apostadores Ativos
          </span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <i className="fa-solid fa-users"></i>
          </div>
        </div>
        <h3 className="font-heading text-2xl sm:text-3xl font-black text-white mb-1">
          {metrics.apostadoresAtivos.toLocaleString('pt-BR')}
        </h3>
        <p className="text-xs text-slate-400">Perfis ativos, sem contas admin</p>
      </div>
    </div>
  );
}
