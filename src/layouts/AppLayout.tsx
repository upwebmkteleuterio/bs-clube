import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import PrototypeMenu from '../components/PrototypeMenu';

/**
 * AppLayout: Wrapper global para as páginas do apostador.
 * Contém a navegação global (BottomNav) e o menu de rotas,
 * renderizando as telas filhas via <Outlet /> do react-router-dom.
 */
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-brand-dark text-slate-50 font-sans flex flex-col relative selection:bg-emerald-500 selection:text-slate-950">
      <div className="flex-1 w-full">
        <Outlet />
      </div>
      <BottomNav />
      <PrototypeMenu />
    </div>
  );
}
