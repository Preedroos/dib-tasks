import { useState, useEffect } from 'react';
import { calculatePriorityByDueDate } from '../helpers/priority';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import type { PriorityType, Stores } from '../types';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddTask: (taskData: {
        description: string;
        dueDate: string;
        priority: PriorityType;
        storeIds?: string[];
    }) => void;
}

export function TaskModal({ isOpen, onClose, onAddTask }: TaskModalProps) {
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<PriorityType>('LOW');
    const [stores, setStores] = useState<Stores[]>([]);
    const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);
    const [loadingStores, setLoadingStores] = useState(false);

    const { profile } = useAuth();
    const showStoreSelect = profile?.role === 'ADMIN' || profile?.role === 'MARKETING';

    useEffect(() => {
        if (isOpen && showStoreSelect) {
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
                    console.error("Erro ao buscar lojas para o modal:", error);
                } finally {
                    setLoadingStores(false);
                }
            };
            fetchStores();
        }
    }, [isOpen, showStoreSelect]);

    if (!isOpen) return null;

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value;
        setDueDate(selectedDate);

        const autoPriority = calculatePriorityByDueDate(selectedDate);
        setPriority(autoPriority);
    };

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        // 1. Validação básica de segurança
        if (!description.trim()) {
            alert("Por favor, insira uma descrição para a demanda.");
            return;
        }

        // 2. Envia os dados encapsulados para o componente pai (Dashboard)
        onAddTask({
            description,
            dueDate,
            priority,
            storeIds: showStoreSelect ? selectedStoreIds : undefined
        });

        // 3. Reseta os campos do formulário para a próxima vez que ele for aberto
        setDescription('');
        setDueDate('');
        setPriority('LOW'); // Ou a sua prioridade padrão
        setSelectedStoreIds([]);

        // 4. Fecha o modal de forma limpa
        onClose();
    };

    const priorityBadgeColors = {
        HIGH: 'text-primary bg-primary-fixed font-bold',
        MEDIUM: 'text-status-pending bg-amber-50 font-bold',
        LOW: 'text-status-in-progress bg-blue-50 font-bold',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center animate-[fadeIn_0.2s_ease-out]">
            {/* Backdrop (Fundo escurecido a 40%) */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Janela do Modal (Bottom sheet no mobile, modal fixo no desktop) */}
            <div className="relative bg-white w-full md:max-w-md rounded-t-3xl md:rounded-2xl p-6 shadow-xl z-10 max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_cubic-bezier(0.4,0,0.2,1)] md:animate-none">

                {/* Barra de arrastar visual para indicar Bottom Sheet no mobile */}
                <div className="w-12 h-1 bg-surface-container rounded-full mx-auto mb-4 md:hidden" />

                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Nova Demanda</h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container active:scale-90 transition-transform">
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Campo Descrição */}
                    <div className="space-y-1">
                        <label className="text-label-md text-on-surface-variant">O que precisa ser feito?</label>
                        <textarea
                            required
                            rows={3}
                            placeholder="Ex: Reposição de ração Premium Salmon na gôndola central..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary text-body-md bg-surface-container-low transition-colors resize-none"
                        />
                    </div>

                    {/* Campo Prazo de Entrega */}
                    <div className="space-y-1">
                        <label className="text-label-md text-on-surface-variant">Prazo Limite (Opcional)</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={handleDateChange}
                            className="w-full h-12 px-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary text-body-md bg-surface-container-low transition-colors"
                        />
                    </div>

                    {/* Badge informativa de prioridade calculada */}
                    <div className="flex items-center justify-between p-3 bg-surface-container rounded-xl">
                        <span className="text-label-md text-on-surface-variant">Prioridade Estimada:</span>
                        <span className={`text-label-md px-3 py-1 rounded-full uppercase tracking-wider transition-colors ${priorityBadgeColors[priority]}`}>
                            {priority === 'HIGH' ? 'Alta' : priority === 'MEDIUM' ? 'Média' : 'Baixa'}
                        </span>
                    </div>

                    {/* Campo de Seleção de Lojas (apenas ADMIN e MARKETING) */}
                    {showStoreSelect && (
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

                    {/* Botão de Envio */}
                    <button
                        type="submit"
                        className="w-full h-12 bg-primary text-on-primary font-label-md rounded-xl shadow-md active:scale-[0.98] transition-all font-bold flex items-center justify-center gap-2 mt-4"
                    >
                        <span className="material-symbols-outlined text-xl">save</span>
                        Criar Tarefa
                    </button>
                </form>
            </div>
        </div>
    );
}