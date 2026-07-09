import type { StatusType, Tasks } from '../types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  title: string;
  tasks: Tasks[];
  isActiveInMobile: boolean;
  onMoveTask?: (taskId: string, newStatus: StatusType) => void;
  onDeleteTask?: (taskId: string) => void;
  onArchiveTask?: (taskId: string) => void;
  onCloseDrawer?: () => void;
  onCardClick?: (task: Tasks) => void;
}

export function KanbanColumn({
  title,
  tasks,
  isActiveInMobile,
  onMoveTask,
  onDeleteTask,
  onArchiveTask,
  onCloseDrawer,
  onCardClick
}: KanbanColumnProps) {
  return (
    <section className={`
      flex-col flex-1 w-full h-full
      ${isActiveInMobile ? 'flex w-full animate-[fadeIn_0.3s_ease-out]' : 'hidden md:flex'}
    `}>

      <div className="flex items-center justify-between px-1 mb-4">
        <h2 className="font-headline-md text-headline-md text-on-surface font-bold flex items-center gap-2">
          {title} <span className="text-on-surface-variant font-normal text-body-md">({tasks.length})</span>
        </h2>

        {onCloseDrawer && (
          <button
            onClick={onCloseDrawer}
            className="hidden md:flex text-on-surface-variant hover:text-primary p-1 rounded-lg hover:bg-surface-container transition-all cursor-pointer"
          >
            <span className="material-symbols-rounded text-lg">close</span>
          </button>
        )}
      </div>

      <div className="space-y-4 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant text-body-md bg-surface-container/60 rounded-2xl border border-dashed border-outline">
            Nenhuma tarefa por aqui.
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onMove={onMoveTask || (() => { })}
              onDelete={onDeleteTask || (() => { })}
              onArchive={onArchiveTask || (() => { })}
              onClick={onCardClick || (() => { })}
            />
          ))
        )}
      </div>
    </section>
  );
}