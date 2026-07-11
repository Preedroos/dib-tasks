import type { StatusType } from '../types';

type FilterStatusType = StatusType | 'ARCHIVED';

interface SegmentedPickerProps {
  activeStatus: FilterStatusType;
  setActiveStatus: (status: FilterStatusType) => void;
}

export function SegmentedPicker({ activeStatus, setActiveStatus }: SegmentedPickerProps) {
  const tabs = [
    { id: 'PENDING' as const, icon: 'assignment', label: 'Pendentes' },
    { id: 'IN_PROGRESS' as const, icon: 'rocket_launch', label: 'Em Produção' },
    { id: 'DONE' as const, icon: 'task_alt', label: 'Concluídos' },
    { id: 'ARCHIVED' as const, icon: 'inventory_2', label: 'Arquivados' },
  ];

  return (
    <div className="bg-surface-container rounded-2xl p-1.5 flex gap-1 mb-6 shadow-inner md:hidden w-full border border-outline-variant/30">
      {tabs.map((tab) => {
        const isActive = activeStatus === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveStatus(tab.id)}
            className={`flex-1 py-3.5 rounded-xl flex items-center justify-center transition-all relative active:scale-95 ${isActive
              ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
              }`}
            title={tab.label}
          >
            <span className={`material-symbols-outlined text-[22px] ${isActive ? 'font-bold' : ''}`}>
              {tab.icon}
            </span>
          </button>
        );
      })}
    </div>
  );
}