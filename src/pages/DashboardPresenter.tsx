import type { ReactNode } from 'react';
import { KanbanColumn } from '../components/KanbanColumn';
import { SegmentedPicker } from '../components/SegmentedPicker';
import type { StatusType, Tasks } from '../types';

type FilterStatusType = StatusType | 'ARCHIVED';

interface DashboardPresenterProps {
  header: ReactNode;
  activeStatus: FilterStatusType;
  setActiveStatus: (status: FilterStatusType) => void;
  pendingTasks: Tasks[];
  inProgressTasks: Tasks[];
  doneTasks: Tasks[];
  archivedTasks: Tasks[];
  handleMoveTask: (taskId: string, newStatus: StatusType) => void;
  handleDeleteTask: (taskId: string) => void;
  handleArchiveTask: (taskId: string) => void;
  handleUnarchiveTask: (taskId: string) => void;
  setSelectedTask: (task: Tasks | null) => void;
  floatingActionButton: ReactNode;
  createModal: ReactNode;
  detailsModal: ReactNode;
  confirmationModal: ReactNode;
}

export function DashboardPresenter({
  header,
  activeStatus,
  setActiveStatus,
  pendingTasks,
  inProgressTasks,
  doneTasks,
  archivedTasks,
  handleMoveTask,
  handleDeleteTask,
  handleArchiveTask,
  handleUnarchiveTask,
  setSelectedTask,
  floatingActionButton,
  createModal,
  detailsModal,
  confirmationModal
}: DashboardPresenterProps) {
  return (
    <div className="bg-surface-container-low min-h-screen pb-32 relative overflow-x-hidden">
      
      {header}

      <main className="px-4 max-w-7xl mx-auto mt-6">
        <SegmentedPicker activeStatus={activeStatus} setActiveStatus={setActiveStatus} />

        <div className="hidden md:flex justify-end items-center mb-6">
          <button
            onClick={() => setActiveStatus('ARCHIVED')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/40 cursor-pointer transition-all active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">archive</span>
            <span className="text-sm font-semibold">Exibir Arquivados</span>
          </button>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 w-full ${activeStatus === 'ARCHIVED' ? 'hidden md:grid' : 'grid'}`}>
          <KanbanColumn
            title="Pendentes"
            tasks={pendingTasks}
            isActiveInMobile={activeStatus === 'PENDING'}
            onMoveTask={handleMoveTask}
            onDeleteTask={handleDeleteTask}
            onArchiveTask={handleArchiveTask}
            onCardClick={setSelectedTask}
          />
          <KanbanColumn
            title="Em Andamento"
            tasks={inProgressTasks}
            isActiveInMobile={activeStatus === 'IN_PROGRESS'}
            onMoveTask={handleMoveTask}
            onDeleteTask={handleDeleteTask}
            onArchiveTask={handleArchiveTask}
            onCardClick={setSelectedTask}
          />
          <KanbanColumn
            title="Concluídas"
            tasks={doneTasks}
            isActiveInMobile={activeStatus === 'DONE'}
            onMoveTask={handleMoveTask}
            onDeleteTask={handleDeleteTask}
            onArchiveTask={handleArchiveTask}
            onCardClick={setSelectedTask}
          />
        </div>

        {activeStatus === 'ARCHIVED' && (
          <>
            <div
              onClick={() => setActiveStatus('PENDING')}
              className="hidden md:block fixed inset-0 bg-black/10 md:backdrop-blur-sm z-40 animate-[fadeIn_0.2s_ease-out]"
            />
            <div className="
              w-full flex 
              md:fixed md:top-0 md:right-0 md:z-50 md:w-96 md:h-full
              md:bg-surface-container-lowest md:p-6 md:shadow-2xl md:border-l md:border-outline-variant
            ">
              <KanbanColumn
                title="Arquivados"
                tasks={archivedTasks}
                isActiveInMobile={true}
                onArchiveTask={handleUnarchiveTask}
                onCloseDrawer={() => setActiveStatus('PENDING')}
                onCardClick={setSelectedTask}
              />
            </div>
          </>
        )}
      </main>

      {floatingActionButton}
      {createModal}
      {detailsModal}
      {confirmationModal}
    </div>
  );
}
