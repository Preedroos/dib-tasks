import type { PriorityType } from '../types';

export function calculatePriorityByDueDate(dueDateString: string | null): PriorityType {
  if (!dueDateString) return 'MEDIUM';

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