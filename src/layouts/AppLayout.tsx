import { Outlet } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import PrototypeMenu from '../components/PrototypeMenu';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-brand-dark text-slate-50 font-sans flex flex-col relative selection:bg-emerald-500 selection:text-slate-950">
      <AppHeader />
      <div className="flex-1 w-full">
        <Outlet />
      </div>
      <BottomNav />
      <PrototypeMenu />
    </div>
  );
}
