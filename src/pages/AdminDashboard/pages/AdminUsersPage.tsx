import React from 'react';
import { useAdmin } from '../context/AdminContext';
import UsersManagementTable from '../components/UsersManagementTable';

export default function AdminUsersPage() {
  const {
    users,
    filteredUsers,
    isUsersLoading,
    userSearchTerm,
    setUserSearchTerm,
    userStatusFilter,
    setUserStatusFilter,
    page,
    totalPages,
    totalCount,
    setPage,
    handleToggleUser,
  } = useAdmin();

  return (
    <div className="max-w-7xl mx-auto">
      <UsersManagementTable
        users={filteredUsers}
        totalCount={totalCount}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isUsersLoading}
        searchTerm={userSearchTerm}
        onSearchChange={setUserSearchTerm}
        statusFilter={userStatusFilter}
        onStatusFilterChange={setUserStatusFilter}
        onToggleUserStatus={handleToggleUser}
      />
    </div>
  );
}
