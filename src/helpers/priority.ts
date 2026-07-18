import type { PriorityType } from '../types';

export const PRIORITY_CONFIG = {
  HIGH: {
    label: 'Prioridade Alta',
    shortLabel: 'Alta',
    cardClass: 'bg-primary text-on-primary',
    badgeClass: 'text-primary bg-primary-fixed font-bold',
  },
  MEDIUM: {
    label: 'Prioridade Média',
    shortLabel: 'Média',
    cardClass: 'bg-status-pending text-white',
    badgeClass: 'text-status-pending bg-amber-50 font-bold',
  },
  LOW: {
    label: 'Prioridade Baixa',
    shortLabel: 'Baixa',
    cardClass: 'bg-status-in-progress text-white',
    badgeClass: 'text-status-in-progress bg-blue-50 font-bold',
  },
} as const;

export function calculatePriorityByDueDate(dueDateString: string | null): PriorityType {
  if (!dueDateString) return 'LOW';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(dueDateString);
  dueDate.setHours(0, 0, 0, 0);

  const differenceInTime = dueDate.getTime() - today.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  if (differenceInDays <= 2) {
    return 'HIGH';
  } else if (differenceInDays <= 7) {
    return 'MEDIUM';
  } else {
    return 'LOW';
  }
}