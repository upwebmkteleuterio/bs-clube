import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: 'fa-house', label: 'Início' },
    { path: '/selecao-dezenas', icon: 'fa-table-cells', label: 'Jogar' },
    { path: '/resultados', icon: 'fa-trophy', label: 'Resultados' },
    { path: '/carteira', icon: 'fa-wallet', label: 'Carteira' },
    { path: '/perfil', icon: 'fa-user', label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 pb-safe">
      <div className="max-w-md mx-auto px-6 py-3 flex justify-between items-center text-xs font-medium">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 w-16 relative transition ${
                isActive ? 'text-brand-accent' : 'text-slate-500 hover:text-white'
              }`}
            >
              {isActive && (
                <div className="absolute -top-3 w-10 h-1 bg-brand-accent rounded-b-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              )}
              <i className={`fa-solid ${item.icon} text-lg mb-0.5`}></i>
              <span className={isActive ? 'font-bold' : ''}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
