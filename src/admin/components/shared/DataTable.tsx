import { type ReactNode } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  sortKey,
  sortDirection,
  onSort,
  emptyMessage = 'Aucune donnée disponible',
  isLoading = false,
}: DataTableProps<T>) {
  const handleSort = (key: string, sortable?: boolean) => {
    if (sortable && onSort) {
      onSort(key);
    }
  };

  if (isLoading) {
    return (
      <div className="table-loading">
        <div className="skeleton" style={{ height: '40px', marginBottom: '8px' }} />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: '50px', marginBottom: '4px' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width }}
                className={column.sortable ? 'sortable' : ''}
                onClick={() => handleSort(column.key, column.sortable)}
              >
                <div className="th-content">
                  {column.header}
                  {column.sortable && (
                    <span className="sort-icons">
                      <ChevronUp 
                        size={14} 
                        className={sortKey === column.key && sortDirection === 'asc' ? 'active' : ''} 
                      />
                      <ChevronDown 
                        size={14} 
                        className={sortKey === column.key && sortDirection === 'desc' ? 'active' : ''} 
                      />
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-row">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={keyExtractor(item)} className="stagger-item">
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render 
                      ? column.render(item) 
                      : String((item as Record<string, unknown>)[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
