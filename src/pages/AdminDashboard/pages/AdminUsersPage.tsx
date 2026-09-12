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
    handleToggleUser,
  } = useAdmin();

  return (
    <div className="max-w-7xl mx-auto">
      <UsersManagementTable
        users={filteredUsers}
        totalCount={users.length}
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
