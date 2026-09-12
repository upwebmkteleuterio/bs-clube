import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import AdminLayout from './layouts/AdminLayout';

// Páginas do Apostador
import Lobby from './pages/Lobby';
import HomeLogada from './pages/HomeLogada';
import SelecaoDezenas from './pages/SelecaoDezenas';
import Resultados from './pages/Resultados';
import Carteira from './pages/Carteira';
import Perfil from './pages/Perfil';

// Páginas Administrativas (com URLs próprias)
import AdminOverviewPage from './pages/AdminDashboard/pages/AdminOverviewPage';
import AdminUsersPage from './pages/AdminDashboard/pages/AdminUsersPage';
import AdminCategoriesPage from './pages/AdminDashboard/pages/AdminCategoriesPage';

/**
 * App: Configuração centralizada de roteamento do sistema.
 * Contém apenas a árvore de rotas e os wrappers de layout (AppLayout e AdminLayout)
 * que renderizam as páginas filhas utilizando <Outlet />.
 */
export default function App() {
  return (
    <Routes>
      {/* Landing Page Pública para Visitantes */}
      <Route path="/lobby" element={<Lobby />} />

      {/* Área do Apostador com AppLayout (Navbar / BottomNav global com <Outlet />) */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomeLogada />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/selecao-dezenas" element={<SelecaoDezenas />} />
        <Route path="/jogar" element={<Navigate to="/selecao-dezenas" replace />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/carteira" element={<Carteira />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      {/* Painel Administrativo com AdminLayout (Sidebar e Header globais com <Outlet />) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOverviewPage />} />
        <Route path="usuarios" element={<AdminUsersPage />} />
        <Route path="categorias" element={<AdminCategoriesPage />} />
      </Route>

      {/* Fallback de rota não encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
