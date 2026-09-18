import React from 'react';
import { Search, Filter, X, Inbox, AlertCircle } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (val: string) => void;
}

interface AdminDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  mobileCardRender?: (item: T) => React.ReactNode;
}

export function AdminDataTable<T>({
  data,
  columns,
  keyExtractor,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filters = [],
  isLoading = false,
  emptyTitle = 'No matching records found',
  emptyDescription = 'Try adjusting your search terms or filter criteria.',
  mobileCardRender,
}: AdminDataTableProps<T>) {
  const hasActiveFilters =
    (searchQuery && searchQuery.trim() !== '') ||
    filters.some((f) => f.value !== 'all' && f.value !== '');

  const handleClearFilters = () => {
    if (onSearchChange) onSearchChange('');
    filters.forEach((f) => f.onChange('all'));
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center shadow-xl">
        {onSearchChange && (
          <div className="w-full md:w-96 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-9 bg-slate-900/90 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 text-xs font-mono-tech rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {filters.map((f) => (
            <div key={f.id} className="flex items-center gap-2">
              <Select
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                options={f.options}
                className="bg-slate-900/90 border-slate-800 text-slate-200 text-xs font-mono-tech rounded-xl min-w-[130px]"
              />
            </div>
          ))}

          {hasActiveFilters && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearFilters}
              className="border-slate-800 text-indigo-400 hover:bg-slate-900 hover:text-indigo-300 text-xs font-mono-tech rounded-xl"
            >
              Clear Filters
            </Button>
          )}

          <div className="text-xs font-mono-tech text-slate-400 px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800/80 shrink-0">
            Total: <span className="font-bold text-white">{data.length}</span>
          </div>
        </div>
      </div>

      {/* Main Table / Mobile Cards */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        {/* Skeleton Loading State */}
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-slate-900/80 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : data.length === 0 ? (
          /* Empty State */
          <div className="py-16 px-6 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
              <Inbox className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-200 font-sans">{emptyTitle}</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto font-mono-tech leading-relaxed">
              {emptyDescription}
            </p>
            {hasActiveFilters && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearFilters}
                className="mt-2 border-slate-800 text-indigo-400 hover:bg-slate-900 text-xs font-mono-tech"
              >
                Reset Search & Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop & Tablet Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono-tech">
                <thead>
                  <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                    {columns.map((col, idx) => (
                      <th
                        key={idx}
                        className={`py-4 px-5 font-semibold ${col.className || ''}`}
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {data.map((item) => (
                    <tr
                      key={keyExtractor(item)}
                      className="hover:bg-slate-900/60 transition-all duration-200 hover:translate-x-0.5"
                    >
                      {columns.map((col, cIdx) => (
                        <td key={cIdx} className={`py-4 px-5 ${col.className || ''}`}>
                          {col.cell
                            ? col.cell(item)
                            : col.accessorKey
                            ? (item[col.accessorKey] as React.ReactNode)
                            : null}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (< 768px) */}
            <div className="block md:hidden p-4 space-y-4">
              {data.map((item) => (
                <div
                  key={keyExtractor(item)}
                  className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3"
                >
                  {mobileCardRender ? (
                    mobileCardRender(item)
                  ) : (
                    <div className="space-y-2">
                      {columns.map((col, cIdx) => (
                        <div
                          key={cIdx}
                          className="flex justify-between items-center text-xs py-1 border-b border-slate-800/50 last:border-0"
                        >
                          <span className="text-slate-400 font-mono-tech uppercase text-[10px]">
                            {col.header}
                          </span>
                          <div className="text-right text-slate-200 font-medium">
                            {col.cell
                              ? col.cell(item)
                              : col.accessorKey
                              ? (item[col.accessorKey] as React.ReactNode)
                              : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
