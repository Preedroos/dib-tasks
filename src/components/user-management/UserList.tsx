import type { MockUser, MockStore } from '../../pages/UserManagement';

interface UserListProps {
    users: MockUser[]; // Virá filtrado do orquestrador
    stores: MockStore[];
    editingId: string | null | undefined;
    onEdit: (user: MockUser) => void;
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
                    Colaboradores Cadastrados ({users.length})
                </h2>
                <div className="relative w-full sm:max-w-xs">
                    <input
                        type="text"
                        placeholder="Buscar por nome ou e-mail..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-container border border-outline/20 text-xs focus:outline-primary placeholder:text-on-surface-variant/60 text-on-surface"
                    />
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant/60">
                        search
                    </span>
                </div>
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
                                className={`p-4 flex items-center justify-between transition-all duration-200 ${isEditing
                                    ? 'border-2 border-primary bg-primary/5 rounded-xl m-2 shadow-xs'
                                    : 'border-b border-outline-variant/30 hover:bg-surface-container-high/10 last:border-0'
                                    } ${!user.isActive && !isEditing ? 'opacity-50 bg-surface-container-low/40' : ''}`}
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-semibold text-on-surface">{user.name}</h3>
                                        {!user.isActive && (
                                            <span className="text-[10px] bg-outline-variant text-on-surface-variant px-1.5 py-0.5 rounded-sm font-bold">
                                                INATIVO
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-on-surface-variant">{user.email}</p>
                                    <p className="text-[11px] text-primary font-medium mt-1">
                                        {user.department === 'MANAGER'
                                            ? (linkedStore ? linkedStore.name : 'Sem loja vinculada')
                                            : 'Acesso Global (Franqueadora)'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
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
                        );
                    })
                )}
            </div>
        </div>
    );
}
