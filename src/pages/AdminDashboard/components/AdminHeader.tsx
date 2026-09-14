import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AdminHeaderProps {
  activeView?: 'dashboard' | 'users' | 'categories';
  isSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
  onToggleSidebar: () => void;
  pendingCount?: number;
}

const VIEW_TITLES = {
  dashboard: {
    title: 'Dashboard Financeiro',
    sub: 'Métricas globais, faturamento e solicitações de saque da plataforma.',
  },
  users: {
    title: 'Gestão de Apostadores',
    sub: 'Lista de apostadores cadastrados, controle de saldo e status de conta.',
  },
  categories: {
    title: 'Bolões',
    sub: 'Configuração e monitoramento de bolões ativos na vitrine.',
  },
};

export default function AdminHeader({
  activeView,
  isSidebarCollapsed = false,
  onToggleSidebarCollapse,
  onToggleSidebar,
  pendingCount = 0,
}: AdminHeaderProps) {
  const location = useLocation();

  const resolvedView: 'dashboard' | 'users' | 'categories' =
    activeView ||
    (location.pathname.includes('/usuarios')
      ? 'users'
      : location.pathname.includes('/categorias')
      ? 'categories'
      : 'dashboard');

  const current = VIEW_TITLES[resolvedView];

  return (
    <header className="h-20 glass-card border-b border-slate-800 flex items-center justify-between px-4 sm:px-8 z-10 flex-shrink-0">
      <div className="flex items-center space-x-4">
        <button
          type="button"
          className="hidden md:flex text-slate-400 hover:text-white p-2 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          onClick={onToggleSidebarCollapse}
          aria-label={isSidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          aria-expanded={!isSidebarCollapsed}
          title={isSidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
        >
          <i className={`fa-solid ${isSidebarCollapsed ? 'fa-angles-right' : 'fa-angles-left'} text-sm`}></i>
        </button>
        <button
          type="button"
          className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          onClick={onToggleSidebar}
          aria-label="Abrir menu"
        >
          <i className="fa-solid fa-bars text-lg"></i>
        </button>
        <div>
          <h2 className="font-heading text-lg sm:text-2xl font-bold text-white leading-tight">
            {current.title}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block">
            {current.sub}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Link
          to="/"
          className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 px-3 py-2 rounded-xl transition"
        >
          <i className="fa-solid fa-arrow-up-right-from-square text-emerald-400"></i>
          <span>Ver App</span>
        </Link>

        <div className="relative">
          <button
            type="button"
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition"
            aria-label="Notificações"
          >
            <i className="fa-regular fa-bell"></i>
          </button>
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-slate-950">
              {pendingCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
