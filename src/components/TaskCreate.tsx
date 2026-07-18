import { useState, useEffect } from 'react';
import { calculatePriorityByDueDate, PRIORITY_CONFIG } from '../helpers/priority';
import { useAuth } from '../contexts/AuthContext';
import { StoreCheckboxList } from './StoreCheckboxList';
import { BaseModal } from './common/BaseModal';
import type { PriorityType, Stores } from '../types';

interface TaskCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (taskData: {
    title: string;
    description: string;
    dueDate: string;
    priority: PriorityType;
    storeIds?: string[];
  }) => void;
  availableStores: Stores[]; // Consome de forma limpa do orquestrador
}

export function TaskCreate({ isOpen, onClose, onAddTask, availableStores }: TaskCreateProps) {
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [isTitleManuallyEdited, setIsTitleManuallyEdited] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<PriorityType>('LOW');
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);

  const { profile } = useAuth();
  const showStoreSelect = profile?.role === 'ADMIN' || profile?.role === 'MARKETING';

  // Auto-população de Título Baseada na Descrição
  useEffect(() => {
    if (!isTitleManuallyEdited) {
      const autoTitle = description
        .replace(/\n/g, ' ')
        .substring(0, 50);

      setTitle(autoTitle);
    }
  }, [description, isTitleManuallyEdited]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setDueDate(selectedDate);
    
    const autoPriority = calculatePriorityByDueDate(selectedDate);
    setPriority(autoPriority);
  };

  const handleClose = () => {
    setDescription('');
    setTitle('');
    setIsTitleManuallyEdited(false);
    setDueDate('');
    setPriority('LOW');
    setSelectedStoreIds([]);
    onClose();
  };
  
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!description.trim() || !title.trim()) {
      alert("Por favor, preencha o título e a descrição da demanda.");
      return;
    }

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
      storeIds: showStoreSelect ? selectedStoreIds : undefined
    });

    // Limpa o estado local pós-envio
    setDescription('');
    setTitle('');
    setIsTitleManuallyEdited(false);
    setDueDate('');
    setPriority('LOW');
    setSelectedStoreIds([]);

    onClose();
  };



  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title="Nova Demanda">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Campo Descrição */}
        <div className="space-y-1">
          <label className="text-label-md text-on-surface-variant">O que precisa ser feito? *</label>
          <textarea
            required
            rows={3}
            placeholder="Descreva detalhadamente a demanda..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary text-body-md bg-surface-container-low transition-colors resize-none"
          />
        </div>

        {/* Campo Título */}
        <div className="space-y-1">
          <label className="text-label-md text-on-surface-variant">Título da Demanda *</label>
          <input
            type="text"
            value={title}
            maxLength={50}
            required
            placeholder="Título resumido"
            onChange={(e) => {
              setIsTitleManuallyEdited(true);
              setTitle(e.target.value);
            }}
            className="w-full p-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary text-body-md bg-surface-container-low transition-colors"
          />
          <p className="text-xs text-on-surface-variant mt-1 text-right">
            {title.length}/50 caracteres
          </p>
        </div>

        {/* Campo Prazo de Entrega */}
        <div className="space-y-1">
          <label className="text-label-md text-on-surface-variant">Prazo Limite</label>
          <input
            type="date"
            value={dueDate}
            onChange={handleDateChange}
            className="w-full h-12 px-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary text-body-md bg-surface-container-low transition-colors"
          />
        </div>

        {/* Badge de prioridade */}
        <div className="flex items-center justify-between p-3 bg-surface-container rounded-xl">
          <span className="text-label-md text-on-surface-variant">Prioridade Estimada:</span>
          <span className={`text-label-md px-3 py-1 rounded-full uppercase tracking-wider transition-colors ${PRIORITY_CONFIG[priority].badgeClass}`}>
            {PRIORITY_CONFIG[priority].shortLabel}
          </span>
        </div>

        {/* Campo de Seleção de Lojas */}
        {showStoreSelect && (
          <div className="space-y-1">
            <label className="text-label-md text-on-surface-variant font-semibold">
              Lojas Vinculadas
            </label>
            <StoreCheckboxList
              availableStores={availableStores}
              selectedStoreIds={selectedStoreIds}
              onChange={setSelectedStoreIds}
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full h-12 bg-primary text-on-primary font-label-md rounded-xl shadow-md active:scale-[0.98] transition-all font-bold flex items-center justify-center gap-2 mt-4"
        >
          <span className="material-symbols-outlined text-xl">save</span>
          Criar Tarefa
        </button>
      </form>
    </BaseModal>
  );
}