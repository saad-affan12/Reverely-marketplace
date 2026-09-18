import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import { Skeleton } from './Skeleton';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  mobileCardRender?: (row: T) => React.ReactNode;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items matching your criteria.',
  emptyAction,
  mobileCardRender,
  pagination,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Mobile Card Grid View */}
      {mobileCardRender && (
        <div className="block md:hidden space-y-3">
          {data.map((row) => (
            <div
              key={keyExtractor(row)}
              className="bg-[#0F1428] border border-white/8 rounded-2xl p-4 shadow-lg text-[#F5F7FF]"
            >
              {mobileCardRender(row)}
            </div>
          ))}
        </div>
      )}

      {/* Desktop Table View */}
      <div className={`overflow-x-auto rounded-2xl border border-white/8 bg-[#0F1428]/90 backdrop-blur-xl shadow-2xl ${mobileCardRender ? 'hidden md:block' : 'block'}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-[#0B1020]/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#9DA9C6] font-mono-tech ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6 text-sm">
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="hover:bg-white/4 transition-colors duration-150 group"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-4 text-[#F5F7FF] ${col.className || ''}`}>
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-2 text-xs text-[#9DA9C6] font-mono-tech">
          <span>
            Page <strong className="text-[#F5F7FF]">{pagination.currentPage}</strong> of{' '}
            <strong className="text-[#F5F7FF]">{pagination.totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage <= 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
