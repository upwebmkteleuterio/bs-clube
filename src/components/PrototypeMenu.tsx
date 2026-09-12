import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PrototypeMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const constraintsRef = useRef(null);

  const routes = [
    { path: '/', label: 'Home (Lobby)', icon: 'fa-house' },
    { path: '/lobby', label: 'Landing Page (Lobby)', icon: 'fa-globe' },
    { path: '/selecao-dezenas', label: 'Seleção Dezenas', icon: 'fa-table-cells' },
    { path: '/resultados', label: 'Resultados / Ranking', icon: 'fa-trophy' },
    { path: '/carteira', label: 'Carteira / Extrato', icon: 'fa-wallet' },
    { path: '/perfil', label: 'Meu Perfil', icon: 'fa-user' },
    { path: '/admin', label: 'Admin (Visão Geral)', icon: 'fa-shield-halved' },
    { path: '/admin/usuarios', label: 'Admin (Apostadores)', icon: 'fa-users' },
    { path: '/admin/categorias', label: 'Admin (Categorias)', icon: 'fa-tags' },
  ];

  return (
    <>
      {/* Invisible bounding box for the draggable element */}
      <div ref={constraintsRef} className="fixed inset-0 z-0 pointer-events-none" />
      
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        className="fixed z-[100] bottom-24 right-4 flex flex-col items-end gap-2"
        style={{ touchAction: 'none' }}
      >
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-slate-900 border border-amber-500/40 rounded-2xl p-2 shadow-2xl shadow-black flex flex-col gap-1 w-52 cursor-default"
            onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when clicking menu items
          >
            <div className="text-[10px] font-bold text-amber-500 uppercase px-2 py-1 mb-1 border-b border-slate-800 flex items-center gap-2">
              <i className="fa-solid fa-compass"></i>
              Navegação Rápida
            </div>
            {routes.map((route) => (
              <button
                key={route.path}
                onClick={() => {
                  navigate(route.path);
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  location.pathname === route.path 
                    ? 'bg-amber-500/20 text-amber-400' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <i className={`fa-solid ${route.icon} w-4 text-center`}></i>
                <span className="text-left">{route.label}</span>
              </button>
            ))}
          </motion.div>
        )}

        <button 
          onPointerDown={(e) => e.stopPropagation()} // Optional: fine-tune interactions
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-transform"
        >
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-layer-group'}`}></i>
        </button>
      </motion.div>
    </>
  );
}
