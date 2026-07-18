import type { Store } from '../../pages/UserManagement';
import { SearchInput } from '../common/SearchInput';

interface StoreListProps {
  stores: Store[]; // Virá filtrado do orquestrador
  editingId: string | null | undefined;
  onEdit: (store: Store) => void;
  onToggleStatus: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function StoreList({
  stores,
  editingId,
  onEdit,
  onToggleStatus,
  searchQuery,
  onSearchChange
}: StoreListProps) {
  return (
    <div>
      {/* Header com Busca */}
      <div className="p-4 border-b border-outline-variant/40 bg-surface-container-high/30 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-bold text-on-surface">
          Unidades ({stores.length})
        </h2>
        <SearchInput
          placeholder="Buscar por nome ou cidade..."
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      {/* Listagem de Lojas */}
      <div className="flex flex-col">
        {stores.length === 0 ? (
          <div className="p-8 text-center text-xs text-on-surface-variant">
            Nenhuma loja encontrada.
          </div>
        ) : (
          stores.map((store) => {
            const isEditing = store.id === editingId;

            return (
              <div
                key={store.id}
                className={`p-4 flex items-center justify-between transition-all duration-200 ${isEditing
                  ? 'border-2 border-primary bg-primary/5 rounded-xl m-2 shadow-xs'
                  : 'border-b border-outline-variant/30 hover:bg-surface-container-high/10 last:border-0'
                  } ${!store.isActive && !isEditing ? 'opacity-50 bg-surface-container-low/40' : ''}`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-on-surface">{store.name}</h3>
                    {!store.isActive && (
                      <span className="text-[10px] bg-outline-variant text-on-surface-variant px-1.5 py-0.5 rounded-sm font-bold">
                        INATIVA
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant">{store.city}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onEdit(store)}
                    className="material-symbols-outlined text-on-surface-variant hover:text-primary text-[20px] cursor-pointer"
                  >
                    edit
                  </button>
                  <button
                    onClick={() => onToggleStatus(store.id)}
                    className={`material-symbols-outlined text-[20px] cursor-pointer ${store.isActive
                      ? 'text-error hover:text-error-hover'
                      : 'text-success hover:text-success-hover'
                      }`}
                  >
                    {store.isActive ? 'toggle_on' : 'toggle_off'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
