import { FormCard } from '../common/FormCard';

export interface StoreFormState {
    id: string;
    name: string;
    city: string;
}

interface StoreFormProps {
    values: StoreFormState;
    onChange: (field: keyof StoreFormState, value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}

export function StoreForm({ values, onChange, onSubmit, onCancel }: StoreFormProps) {
    const isEditing = !!values.id;

    const actions = (
        <>
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
        </>
    );

    return (
        <FormCard
            title={isEditing ? 'Editar Unidade' : 'Nova Unidade'}
            onSubmit={onSubmit}
            actions={actions}
        >
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface-variant">Nome da Unidade</label>
                <input
                    type="text"
                    value={values.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    placeholder="Ex: Ceará"
                    className="px-3 py-2 rounded-xl bg-surface-container border border-outline/20 text-sm focus:outline-primary w-full"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface-variant">Cidade</label>
                <input
                    type="text"
                    value={values.city}
                    onChange={(e) => onChange('city', e.target.value)}
                    placeholder="Ex: Campo Grande"
                    className="px-3 py-2 rounded-xl bg-surface-container border border-outline/20 text-sm focus:outline-primary w-full"
                />
            </div>
        </FormCard>
    );
}
