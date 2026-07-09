import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { calculatePriorityByDueDate } from '../helpers/priority';
import type { Tasks, RoleType, Stores, PriorityType } from '../types';

interface TaskDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Tasks | null;
    userRole?: RoleType;
    onUpdateNote: (taskId: string, note: string) => Promise<void>;
    onUpdateDueDate: (taskId: string, newDate: string) => Promise<void>;
    onUpdateStores: (taskId: string, storeIds: string[]) => Promise<void>;
}

export function TaskDetailsModal({
    isOpen,
    onClose,
    task,
    userRole,
    onUpdateNote,
    onUpdateDueDate,
    onUpdateStores,
}: TaskDetailsModalProps) {
    const [localNote, setLocalNote] = useState('');
    const [localDueDate, setLocalDueDate] = useState('');
    const [previewPriority, setPreviewPriority] = useState<PriorityType>('LOW');
    const [saving, setSaving] = useState(false);
    const [stores, setStores] = useState<Stores[]>([]);
    const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);
    const [loadingStores, setLoadingStores] = useState(false);

    const canEdit = userRole === 'ADMIN' || userRole === 'MARKETING';

    useEffect(() => {
        if (isOpen && canEdit) {
            const fetchStores = async () => {
                setLoadingStores(true);
                try {
                    const q = query(collection(db, 'stores'), orderBy('name'));
                    const querySnapshot = await getDocs(q);
                    const fetchedStores: Stores[] = [];
                    querySnapshot.forEach((docSnap) => {
                        const data = docSnap.data();
                        if (data.deleted_at === null || data.deleted_at === undefined) {
                            fetchedStores.push({
                                id: docSnap.id,
                                name: data.name,
                                city: data.city,
                                created_at: data.created_at
                            });
                        }
                    });
                    setStores(fetchedStores);
                } catch (error) {
                    console.error("Erro ao buscar lojas para o modal de detalhes:", error);
                } finally {
                    setLoadingStores(false);
                }
            };
            fetchStores();
        }
    }, [isOpen, canEdit]);

    useEffect(() => {
        if (task) {
            setLocalNote(task.note || '');
            setLocalDueDate(task.due_date ? task.due_date.split('T')[0] : '');
            setPreviewPriority(task.priority);
            setSelectedStoreIds(task.store_ids || []);
        }
    }, [task, isOpen]);

    if (!isOpen || !task) return null;

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setLocalDueDate(newDate);
        const newPriority = calculatePriorityByDueDate(newDate);
        setPreviewPriority(newPriority);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Check if note has changed
            const originalNote = task.note || '';
            if (localNote !== originalNote) {
                await onUpdateNote(task.id, localNote);
            }
            // Check if due date has changed
            const originalDueDate = task.due_date ? task.due_date.split('T')[0] : '';
            if (localDueDate !== originalDueDate) {
                await onUpdateDueDate(task.id, localDueDate);
            }
            // Check if store_ids has changed
            const originalStoreIds = task.store_ids || [];
            const hasStoresChanged = 
                selectedStoreIds.length !== originalStoreIds.length || 
                !selectedStoreIds.every(id => originalStoreIds.includes(id));
            if (hasStoresChanged) {
                await onUpdateStores(task.id, selectedStoreIds);
            }
            onClose();
        } catch (error) {
            console.error("Erro ao salvar atualizações no modal de detalhes:", error);
            alert("Erro ao salvar alterações.");
        } finally {
            setSaving(false);
        }
    };

    const priorityBadgeColors = {
        HIGH: 'text-primary bg-primary-fixed font-bold',
        MEDIUM: 'text-status-pending bg-amber-50 font-bold',
        LOW: 'text-status-in-progress bg-blue-50 font-bold',
    };

    const formatDateString = (isoString: string | null) => {
        if (!isoString) return 'Sem prazo';
        const date = new Date(isoString);
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center animate-[fadeIn_0.2s_ease-out]">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Body */}
            <div className="relative bg-white w-full md:max-w-md rounded-t-3xl md:rounded-2xl p-6 shadow-xl z-10 max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_cubic-bezier(0.4,0,0.2,1)] md:animate-none">
                
                {/* Drag handle on mobile */}
                <div className="w-12 h-1 bg-surface-container rounded-full mx-auto mb-4 md:hidden" />

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Detalhes da Demanda</h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container active:scale-90 transition-transform">
                        <span className="material-symbols-rounded text-xl">close</span>
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                    {/* Descrição */}
                    <div className="space-y-1">
                        <label className="text-label-md text-on-surface-variant font-semibold">Descrição do Gerente</label>
                        <div className="w-full p-4 rounded-xl border border-outline-variant/60 bg-surface-container-low text-body-md text-on-surface whitespace-pre-wrap leading-relaxed">
                            {task.description}
                        </div>
                    </div>

                    {/* Prioridade */}
                    <div className="flex items-center justify-between p-3 bg-surface-container rounded-xl">
                        <span className="text-label-md text-on-surface-variant">Prioridade Estimada:</span>
                        <span className={`text-label-md px-3 py-1 rounded-full uppercase tracking-wider transition-colors ${priorityBadgeColors[previewPriority]}`}>
                            {previewPriority === 'HIGH' ? 'Alta' : previewPriority === 'MEDIUM' ? 'Média' : 'Baixa'}
                        </span>
                    </div>

                    {/* Prazo Limite */}
                    <div className="space-y-1">
                        <label className="text-label-md text-on-surface-variant font-semibold">Prazo Limite</label>
                        {canEdit ? (
                            <input
                                type="date"
                                value={localDueDate}
                                onChange={handleDateChange}
                                className="w-full h-12 px-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary text-body-md bg-surface-container-low transition-colors"
                            />
                        ) : (
                            <div className="w-full h-12 flex items-center px-4 rounded-xl border border-outline-variant/60 bg-surface-container-low text-body-md text-on-surface">
                                {formatDateString(task.due_date)}
                            </div>
                        )}
                    </div>

                    {/* Lojas Vinculadas (Apenas ADMIN e MARKETING) */}
                    {canEdit && (
                        <div className="space-y-1">
                            <label className="text-label-md text-on-surface-variant font-semibold">
                                Lojas Vinculadas
                            </label>
                            <div className="border border-outline-variant/60 rounded-xl bg-surface-container-low max-h-36 overflow-y-auto p-3 space-y-2">
                                {loadingStores ? (
                                    <p className="text-sm text-on-surface-variant animate-pulse">
                                        Carregando lojas...
                                    </p>
                                ) : stores.length === 0 ? (
                                    <p className="text-sm text-on-surface-variant">
                                        Nenhuma loja ativa cadastrada.
                                    </p>
                                ) : (
                                    stores.map((store) => {
                                        const isChecked = selectedStoreIds.includes(store.id);
                                        return (
                                            <label
                                                key={store.id}
                                                className="flex items-center gap-3 cursor-pointer select-none text-body-md text-on-surface hover:bg-surface-container p-1.5 rounded-lg transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => {
                                                        if (isChecked) {
                                                            setSelectedStoreIds(
                                                                selectedStoreIds.filter((id) => id !== store.id)
                                                            );
                                                        } else {
                                                            setSelectedStoreIds([...selectedStoreIds, store.id]);
                                                        }
                                                    }}
                                                    className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                                                />
                                                <span>{store.name}</span>
                                            </label>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notas Administrativas */}
                    <div className="space-y-1">
                        <label className="text-label-md text-on-surface-variant font-semibold">Notas da Administração</label>
                        {canEdit ? (
                            <textarea
                                rows={4}
                                placeholder="Adicione observações ou notas administrativas..."
                                value={localNote}
                                onChange={(e) => setLocalNote(e.target.value)}
                                className="w-full p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary text-body-md bg-surface-container-low transition-colors resize-none"
                            />
                        ) : (
                            <div className="w-full p-4 rounded-xl border border-outline-variant/60 bg-surface-container-low text-body-md text-on-surface whitespace-pre-wrap min-h-[100px] leading-relaxed">
                                {task.note || 'Nenhuma nota de observação registrada.'}
                            </div>
                        )}
                    </div>

                    {/* Botão de Envio (apenas ADMIN e MARKETING) */}
                    {canEdit && (
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full h-12 bg-primary text-on-primary font-label-md rounded-xl shadow-md active:scale-[0.98] transition-all font-bold flex items-center justify-center gap-2 mt-6 disabled:opacity-75 disabled:pointer-events-none"
                        >
                            <span className="material-symbols-rounded text-xl">
                                {saving ? 'hourglass_empty' : 'save'}
                            </span>
                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
