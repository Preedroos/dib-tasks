import type { RoleType } from '../../types';
import type { Store } from '../../pages/UserManagement';

export interface UserFormState {
    id: string;
    name: string;
    email: string;
    department: RoleType;
    store_id: string;
}

interface UserFormProps {
    values: UserFormState;
    activeStores: Store[];
    onChange: (field: keyof UserFormState, value: any) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}

export function UserForm({ values, activeStores, onChange, onSubmit, onCancel }: UserFormProps) {
    const isEditing = !!values.id;

    return (
        <form onSubmit={onSubmit} className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 space-y-4 shadow-xs">
            <h2 className="text-title-medium font-bold text-on-surface">
                {isEditing ? 'Editar Colaborador' : 'Novo Colaborador'}
            </h2>

            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface-variant">Nome Completo</label>
                <input
                    type="text"
                    value={values.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    placeholder="Ex: João Silva"
                    className="px-3 py-2 rounded-xl bg-surface-container border border-outline/20 text-sm focus:outline-primary w-full"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface-variant">E-mail</label>
                <input
                    type="email"
                    value={values.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    placeholder="nome@doginbox.com"
                    className="px-3 py-2 rounded-xl bg-surface-container border border-outline/20 text-sm focus:outline-primary w-full"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface-variant">Setor (Acesso)</label>
                <select
                    value={values.department}
                    onChange={(e) => onChange('department', e.target.value as RoleType)}
                    className="px-3 py-2 rounded-xl bg-surface-container border border-outline/20 text-sm focus:outline-primary w-full"
                >
                    <option value="MANAGER">manager de Loja</option>
                    <option value="MARKETING">Marketing (Franqueadora)</option>
                    <option value="ADMIN">administrador</option>
                </select>
            </div>

            {values.department === 'MANAGER' && (
                <div className="flex flex-col gap-1 animate-[fadeIn_0.2s_ease-out]">
                    <label className="text-xs font-semibold text-on-surface-variant">Vincular à Loja Ativa</label>
                    <select
                        value={values.store_id}
                        onChange={(e) => onChange('store_id', e.target.value)}
                        className="px-3 py-2 rounded-xl bg-surface-container border border-outline/20 text-sm focus:outline-primary w-full"
                    >
                        <option value="">Selecione uma loja...</option>
                        {activeStores.filter(s => s.isActive).map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="flex gap-2 pt-2">
                <button
                    type="submit"
                    className="flex-1 py-2 bg-primary text-on-primary font-semibold text-sm rounded-xl hover:bg-primary-hover transition-all cursor-pointer"
                >
                    {isEditing ? 'Atualizar' : 'Cadastrar'}
                </button>
                {isEditing && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-3 py-2 border border-outline text-on-surface font-semibold text-sm rounded-xl hover:bg-surface-container transition-all cursor-pointer"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}
