import { useState } from 'react';
import { Search, ChevronRight, ChevronLeft } from 'lucide-react';
import Loading, { EmptyState } from '../common/Loading';
import { useI18n } from '../../i18n/I18nProvider';

export default function DataTable({ columns, data, meta, loading, onPageChange, onSearch, searchPlaceholder, actions }) {
  const { t, isRtl } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const visibleColumns = columns.filter((col) => col.key !== 'id');
  const alignClass = isRtl ? 'text-right' : 'text-left';
  const searchIconClass = `absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400`;
  const searchInputClass = `w-full ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`;
  const PreviousIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-gray-100">
      {onSearch && (
        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className={searchIconClass} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder || t('common.table.searchPlaceholder')}
                className={searchInputClass}
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark">{t('common.actions.search')}</button>
          </form>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : !data || data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {visibleColumns.map((col) => (
                  <th key={col.key} className={`${alignClass} px-4 py-3 font-medium text-gray-500 whitespace-nowrap`}>
                    {col.label}
                  </th>
                ))}
                {actions && <th className={`${alignClass} px-4 py-3 font-medium text-gray-500`}>{t('common.table.actions')}</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id || i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  {visibleColumns.map((col) => (
                    <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {actions && <td className="px-4 py-3">{actions(row)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {t('common.pagination.range', {
              from: ((meta.page - 1) * meta.limit) + 1,
              to: Math.min(meta.page * meta.limit, meta.total),
              total: meta.total,
            })}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(meta.page - 1)}
              disabled={meta.page <= 1}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <PreviousIcon size={16} />
            </button>
            <span className="px-3 py-1 text-sm font-medium">{meta.page} / {meta.totalPages}</span>
            <button
              onClick={() => onPageChange?.(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <NextIcon size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
