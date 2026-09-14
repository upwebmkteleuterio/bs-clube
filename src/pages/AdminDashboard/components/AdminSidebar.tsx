import React from 'react';
import { Link, NavLink } from 'react-router-dom';

interface AdminSidebarProps {
  isOpen: boolean;
  isCollapsed?: boolean;
  onClose: () => void;
  activeView?: 'dashboard' | 'users' | 'categories';
  onSelectView?: (view: 'dashboard' | 'users' | 'categories') => void;
}

export default function AdminSidebar({
  isOpen,
  isCollapsed = false,
  onClose,
  onSelectView,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 ${isCollapsed ? 'md:w-20' : 'md:w-64'} bg-slate-900 border-r border-slate-800 flex flex-col transform transition-[width,transform] duration-300 md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className={`h-20 flex items-center px-6 border-b border-slate-800 justify-between ${isCollapsed ? 'md:px-3 md:justify-center' : ''}`}>
          <Link to="/" className="flex items-center space-x-2.5 cursor-pointer" aria-label="BS CLUBE Painel Admin">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-brand-accent flex items-center justify-center text-white font-bold shadow-md shadow-emerald-900/50">
              <i className="fa-solid fa-clover text-base"></i>
            </div>
            <div className={isCollapsed ? 'md:hidden' : ''}>
              <h1 className="font-heading font-black text-xl text-white leading-none tracking-tight">
                BS CLUBE
              </h1>
              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">
                Painel Admin
              </span>
            </div>
          </Link>
          <button
            type="button"
            className="md:hidden text-slate-400 hover:text-white p-1 cursor-pointer"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 flex flex-col space-y-1">
          <div className={`px-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider ${isCollapsed ? 'md:hidden' : ''}`}>
            Gestão
          </div>

          <NavLink
            to="/admin"
            end
            title={isCollapsed ? 'Visão Geral' : undefined}
            onClick={() => {
              onSelectView?.('dashboard');
              onClose();
            }}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 ${isCollapsed ? 'md:px-0 md:justify-center' : ''} text-sm font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-r-4 border-emerald-500 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <i className="fa-solid fa-chart-pie w-5 text-left"></i>
            <span className={isCollapsed ? 'md:hidden' : ''}>Visão Geral</span>
          </NavLink>

          <NavLink
            to="/admin/usuarios"
            title={isCollapsed ? 'Apostadores' : undefined}
            onClick={() => {
              onSelectView?.('users');
              onClose();
            }}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 ${isCollapsed ? 'md:px-0 md:justify-center' : ''} text-sm font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-r-4 border-emerald-500 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <i className="fa-solid fa-users w-5 text-left"></i>
            <span className={isCollapsed ? 'md:hidden' : ''}>Apostadores</span>
          </NavLink>

          <NavLink
            to="/admin/categorias"
            title={isCollapsed ? 'Bolões' : undefined}
            onClick={() => {
              onSelectView?.('categories');
              onClose();
            }}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 ${isCollapsed ? 'md:px-0 md:justify-center' : ''} text-sm font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-r-4 border-emerald-500 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <i className="fa-solid fa-tags w-5 text-left"></i>
            <span className={isCollapsed ? 'md:hidden' : ''}>Bolões</span>
          </NavLink>

          <div className={`px-6 mt-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider ${isCollapsed ? 'md:hidden' : ''}`}>
            Atalhos
          </div>

          <Link
            to="/"
            className={`flex items-center px-6 py-3 ${isCollapsed ? 'md:px-0 md:justify-center' : ''} text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer`}
            title={isCollapsed ? 'Ir para o App' : undefined}
          >
            <i className="fa-solid fa-arrow-left w-5 text-left"></i>
            <span className={isCollapsed ? 'md:hidden' : ''}>Ir para o App</span>
          </Link>
        </nav>

        {/* User Profile Footer */}
        <div className={`p-4 border-t border-slate-800 bg-slate-900/50 ${isCollapsed ? 'md:px-2' : ''}`}>
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'md:justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <div className={`text-left flex-1 min-w-0 ${isCollapsed ? 'md:hidden' : ''}`}>
              <p className="text-sm font-bold text-white truncate">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
