import React from 'react';

interface AdminPaginationProps {
  itemCount: number;
  totalCount: number;
  page: number;
  totalPages: number;
  itemLabel: string;
  ariaLabel: string;
  onPageChange: (page: number) => void;
}

export default function AdminPagination({
  itemCount,
  totalCount,
  page,
  totalPages,
  itemLabel,
  ariaLabel,
  onPageChange,
}: AdminPaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);

  return (
    <div className="p-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 bg-slate-900/40 gap-4">
      <span>
        Exibindo <strong className="text-white">{itemCount}</strong> de{' '}
        <strong className="text-white">{totalCount}</strong> {itemLabel}
      </span>
      <div className="flex space-x-1" aria-label={ariaLabel}>
        <button
          type="button"
          className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
        >
          <i className="fa-solid fa-chevron-left text-[10px]"></i>
        </button>
        {Array.from({ length: safeTotalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            aria-current={pageNumber === page ? 'page' : undefined}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              pageNumber === page
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          type="button"
          className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= safeTotalPages}
          aria-label="Próxima página"
        >
          <i className="fa-solid fa-chevron-right text-[10px]"></i>
        </button>
      </div>
    </div>
  );
}
