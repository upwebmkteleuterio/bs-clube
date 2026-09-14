import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import AdminLayout from './layouts/AdminLayout';
import { RequireAdmin, RequireAuth } from './components/RouteGuards';
import AuthPage from './pages/Auth';

import Lobby from './pages/Lobby';
import HomeLogada from './pages/HomeLogada';
import SelecaoDezenas from './pages/SelecaoDezenas';
import Resultados from './pages/Resultados';
import Carteira from './pages/Carteira';
import Perfil from './pages/Perfil';

import AdminOverviewPage from './pages/AdminDashboard/pages/AdminOverviewPage';
import AdminUsersPage from './pages/AdminDashboard/pages/AdminUsersPage';
import AdminCategoriesPage from './pages/AdminDashboard/pages/AdminCategoriesPage';
import AdminQuotasPage from './pages/AdminDashboard/pages/AdminQuotasPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage view="sign_in" />} />
      <Route path="/cadastro" element={<AuthPage view="sign_up" />} />
      <Route path="/lobby" element={<Lobby />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<HomeLogada />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/selecao-dezenas" element={<SelecaoDezenas />} />
        <Route path="/jogar" element={<Navigate to="/selecao-dezenas" replace />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route element={<RequireAuth />}>
          <Route path="/carteira" element={<Carteira />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Route>

      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="usuarios" element={<AdminUsersPage />} />
          <Route path="categorias" element={<AdminCategoriesPage />} />
          <Route path="cotas" element={<AdminQuotasPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
