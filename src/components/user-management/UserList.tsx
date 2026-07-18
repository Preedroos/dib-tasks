import type { Store, User } from '../../pages/UserManagement';
import { SearchInput } from '../common/SearchInput';

interface UserListProps {
  users: User[]; // Virá filtrado do orquestrador
  stores: Store[];
  editingId: string | null | undefined;
  onEdit: (user: User) => void;
  onToggleStatus: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function UserList({
  users,
  stores,
  editingId,
  onEdit,
  onToggleStatus,
  searchQuery,
  onSearchChange
}: UserListProps) {
  return (
    <div>
      {/* Header com Busca */}
      <div className="p-4 border-b border-outline-variant/40 bg-surface-container-high/30 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-bold text-on-surface">
          Colaboradores ({users.length})
        </h2>
        <SearchInput
          placeholder="Buscar por nome ou e-mail..."
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      {/* Listagem de Colaboradores */}
      <div className="flex flex-col">
        {users.length === 0 ? (
          <div className="p-8 text-center text-xs text-on-surface-variant">
            Nenhum colaborador encontrado.
          </div>
        ) : (
          users.map((user) => {
            const linkedStore = stores.find(s => s.id === user.store_id);
            const isEditing = user.id === editingId;

            return (
              <div
                key={user.id}
                className={`p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between transition-all duration-200 ${isEditing 
                  ? 'border-2 border-primary bg-primary/5 rounded-xl m-2 shadow-xs' 
                  : 'border-b border-outline-variant/30 hover:bg-surface-container-high/10 last:border-0'
                  } ${!user.isActive && !isEditing ? 'opacity-50 bg-surface-container-low/40' : ''}`}
              >
                {/* Bloco de Informações (Esquerda) */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-on-surface">{user.name}</h3>
                    {!user.isActive && (
                      <span className="text-[10px] bg-outline-variant text-on-surface-variant px-1.5 py-0.5 rounded-sm font-bold">
                        INATIVO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant break-all">{user.email}</p>
                  <p className="text-[11px] text-primary font-medium mt-1">
                    {user.department === 'MANAGER'
                      ? (linkedStore ? linkedStore.name : 'Sem loja vinculada')
                      : 'Acesso Global (Franqueadora)'}
                  </p>
                </div>

                {/* Bloco de Ações (Direita/Baixo) */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t border-outline-variant/20 pt-3 sm:border-0 sm:pt-0">
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${user.department === 'ADMIN'
                      ? 'bg-error-container text-on-error-container'
                      : user.department === 'MARKETING'
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-secondary-container text-on-secondary-container'
                      }`}
                  >
                    {user.department}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onEdit(user)}
                      className="material-symbols-outlined text-on-surface-variant hover:text-primary text-[20px] cursor-pointer"
                    >
                      edit
                    </button>
                    <button
                      onClick={() => onToggleStatus(user.id)}
                      className={`material-symbols-outlined text-[20px] cursor-pointer ${user.isActive
                        ? 'text-error hover:text-error-hover'
                        : 'text-success hover:text-success-hover'
                        }`}
                    >
                      {user.isActive ? 'toggle_on' : 'toggle_off'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
