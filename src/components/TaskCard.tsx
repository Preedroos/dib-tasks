import { PRIORITY_CONFIG } from '../helpers/priority';
import { formatShortDate } from '../helpers/date';
import type { StatusType, Tasks } from '../types';

interface TaskCardProps {
  task: Tasks;
  onMove: (taskId: string, newStatus: StatusType) => void;
  onDelete: (taskId: string) => void;
  onArchive: (taskId: string) => void;
  onClick: (task: Tasks) => void;
}

export function TaskCard({ task, onMove, onDelete, onArchive, onClick }: TaskCardProps) {
  const priorityInfo = PRIORITY_CONFIG[task.priority];

  return (
    <div
      onClick={() => onClick(task)}
      className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant relative overflow-hidden group cursor-pointer hover:border-primary/40 transition-colors"
    >
      <div className="paw-watermark absolute -bottom-0 -left-0 w-20 h-20 text-primary" />

      <div className="flex justify-between items-start mb-3 relative z-10">

        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${priorityInfo.cardClass}`}>
          {priorityInfo.label}
        </span>

        {task.due_date && (
          <span className="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {formatShortDate(task.due_date)}
          </span>
        )}

        {task.note && task.note.trim() !== '' && (
          <span className="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1" title="Possui notas administrativas">
            <span className="material-symbols-outlined text-[16px]">notes</span>
          </span>
        )}

        {task.status === "PENDING" ? (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            className="text-error/60 hover:text-error w-8 h-8 rounded-lg hover:bg-error/10 flex items-center justify-center active:scale-90 transition-all relative z-20"
            title="Apagar tarefa"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onArchive(task.id); }}
            className="text-error/60 hover:text-error w-8 h-8 rounded-lg hover:bg-error/10 flex items-center justify-center active:scale-90 transition-all relative z-20"
            title="Arquivar tarefa"
          >
            <span className="material-symbols-outlined text-lg">archive</span>
          </button>
        )}

      </div>

      <p className="font-headline-md text-headline-md text-on-surface mb-1 relative z-10">
        {task.title}
      </p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-container relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-label-sm text-on-surface-variant">Admin</span>
        </div>

        <div className="flex gap-1">
          {task.status === 'DONE' && (
            <button
              onClick={(e) => { e.stopPropagation(); onMove(task.id, 'IN_PROGRESS'); }}
              className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant active:scale-90 transition-transform"
              title="Voltar para Em Andamento"
            >
              <span className="material-symbols-outlined text-lg">undo</span>
            </button>
          )}

          {task.status !== 'DONE' && (
            <button
              onClick={(e) => { e.stopPropagation(); onMove(task.id, task.status === 'PENDING' ? 'IN_PROGRESS' : 'DONE'); }}
              className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold active:scale-90 transition-transform"
              title="Avançar etapa"
            >
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}