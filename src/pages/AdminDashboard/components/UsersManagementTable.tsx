import React from 'react';
import AdminPagination from '../../../components/AdminPagination';
import { AdminUser } from '../../../types';

interface UsersManagementTableProps {
  users: AdminUser[];
  totalCount: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: 'all' | 'active' | 'blocked';
  onStatusFilterChange: (status: 'all' | 'active' | 'blocked') => void;
  onToggleUserStatus: (id: number | string) => void;
}

export default function UsersManagementTable({
  users,
  totalCount,
  page = 1,
  totalPages = 1,
  onPageChange,
  isLoading,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onToggleUserStatus,
}: UsersManagementTableProps) {
  const formatCurrency = (val: number) =>
    `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-slate-900/90 p-4 rounded-2xl border border-slate-800 gap-4">
        <div className="relative w-full sm:w-80">
          <i className="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome ou celular..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition placeholder:text-slate-600"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onStatusFilterChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800 cursor-pointer'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Ativos
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('blocked')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              statusFilter === 'blocked'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Bloqueados
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="p-4">ID</th>
                <th className="p-4">Nome do Apostador</th>
                <th className="p-4">WhatsApp</th>
                <th className="p-4 text-right">Saldo Real</th>
                <th className="p-4 text-right">Bônus</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    <i className="fa-solid fa-circle-notch fa-spin text-emerald-400 text-base mr-2"></i>
                    Carregando apostadores...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    Nenhum apostador encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 text-slate-500 font-mono text-[11px]">#{u.id}</td>
                    <td className="p-4 font-bold text-white flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">
                        <i className="fa-solid fa-user"></i>
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="p-4 text-slate-400 text-xs font-mono">{u.phone}</td>
                    <td className="p-4 text-right font-medium text-emerald-400 font-mono">
                      {formatCurrency(u.balance)}
                    </td>
                    <td className="p-4 text-right font-medium text-amber-400 font-mono">
                      {formatCurrency(u.bonus)}
                    </td>
                    <td className="p-4 text-center">
                      {u.active ? (
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
                          Ativo
                        </span>
                      ) : (
                        <span className="bg-rose-500/10 text-rose-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-rose-500/20">
                          Bloqueado
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center space-x-2">
                      <button
                        type="button"
                        onClick={() => onToggleUserStatus(u.id)}
                        className={`p-1.5 rounded-lg transition text-xs cursor-pointer ${
                          u.active
                            ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                            : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                        title={u.active ? 'Bloquear usuário' : 'Desbloquear usuário'}
                      >
                        <i className={`fa-solid ${u.active ? 'fa-ban' : 'fa-unlock'}`}></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          itemCount={users.length}
          totalCount={totalCount}
          page={page}
          totalPages={totalPages}
          itemLabel="apostadores"
          ariaLabel="Paginação de apostadores"
          onPageChange={(nextPage) => onPageChange?.(nextPage)}
        />
      </div>
    </div>
  );
}
