import React from 'react';
import { useAdmin } from '../context/AdminContext';
import CategoriesManagementTable from '../components/CategoriesManagementTable';

export default function AdminCategoriesPage() {
  const {
    categories,
    isCategoriesLoading,
    setIsCategoryModalOpen,
  } = useAdmin();

  return (
    <div className="max-w-7xl mx-auto">
      <CategoriesManagementTable
        categories={categories}
        isLoading={isCategoriesLoading}
        onOpenNewCategory={() => setIsCategoryModalOpen(true)}
      />
    </div>
  );
}
