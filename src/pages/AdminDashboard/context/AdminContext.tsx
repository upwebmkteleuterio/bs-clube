import React, { createContext, useContext } from 'react';
import { useAdminDashboardState } from '../hooks/useAdminDashboardState';

type AdminContextType = ReturnType<typeof useAdminDashboardState>;

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const adminState = useAdminDashboardState();
  return <AdminContext.Provider value={adminState}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin deve ser utilizado dentro de um AdminProvider');
  }
  return context;
}
