import type { ReactNode } from 'react';
import { SearchInput } from './SearchInput';

interface DataListProps<T> {
  title: string;
  items: T[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  emptyMessage: string;
  renderItem: (item: T) => ReactNode;
}

export function DataList<T>({
  title,
  items,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  emptyMessage,
  renderItem
}: DataListProps<T>) {
  return (
    <div>
      {/* Header com Busca */}
      <div className="p-4 border-b border-outline-variant/40 bg-surface-container-high/30 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-bold text-on-surface">
          {title} ({items.length})
        </h2>
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      {/* Listagem */}
      <div className="flex flex-col">
        {items.length === 0 ? (
          <div className="p-8 text-center text-xs text-on-surface-variant">
            {emptyMessage}
          </div>
        ) : (
          items.map((item) => renderItem(item))
        )}
      </div>
    </div>
  );
}
