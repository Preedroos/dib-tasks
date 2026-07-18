import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KanbanColumn } from '../components/KanbanColumn';
import { SegmentedPicker } from '../components/SegmentedPicker';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { TaskCreate } from '../components/TaskCreate';
import { Header } from '../components/Header';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { TaskDetailsModal } from '../components/TaskDetailsModal';
import { useTasks } from '../hooks/useTasks';
import { useStores } from '../hooks/useStores';
import { useAuth } from '../contexts/AuthContext';
import type { StatusType, Tasks } from '../types';

type FilterStatusType = StatusType | 'ARCHIVED';

export function Dashboard() {
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState<FilterStatusType>('PENDING');
  const [isTaskCreateOpen, setIsTaskCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Tasks | null>(null);
  const { profile, logout } = useAuth();

  const { stores } = useStores();
  const {
    tasks,
    pendingAction,
    pendingTasks,
    inProgressTasks,
    doneTasks,
    archivedTasks,
    handleMoveTask,
    handleDeleteTask,
    handleArchiveTask,
    handleUnarchiveTask,
    handleAddTask,
    handleUpdateNote,
    handleUpdateDueDate,
    handleUpdateStores,
    confirmPendingAction,
    cancelPendingAction
  } = useTasks();

  const currentSelectedTask = tasks.find((t) => t.id === selectedTask?.id) || null;

  return (
    <div className="bg-surface-container-low min-h-screen pb-32 relative overflow-x-hidden">

      <Header
        actionIcon="settings_account_box"
        onActionClick={() => {
          navigate('/usermanagement');
        }}
        onLogout={logout}
      />

      <main className="px-4 max-w-7xl mx-auto mt-6">

        <SegmentedPicker activeStatus={activeStatus} setActiveStatus={setActiveStatus} />

        <div className="hidden md:flex justify-end items-center mb-6">
          <button
            onClick={() => setActiveStatus('ARCHIVED')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/40 cursor-pointer transition-all active:scale-95"
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

      <FloatingActionButton icon="add" onClick={() => setIsTaskCreateOpen(true)} />

      <TaskCreate
        isOpen={isTaskCreateOpen}
        onClose={() => setIsTaskCreateOpen(false)}
        onAddTask={handleAddTask}
        availableStores={stores}
      />

      <TaskDetailsModal
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        task={currentSelectedTask}
        userRole={profile?.role}
        availableStores={stores}
        onUpdateNote={handleUpdateNote}
        onUpdateDueDate={handleUpdateDueDate}
        onUpdateStores={handleUpdateStores}
      />

      <ConfirmationModal
        isOpen={pendingAction !== null}
        onClose={cancelPendingAction}
        onConfirm={confirmPendingAction}
        title={pendingAction?.type === 'delete' ? 'Excluir Tarefa' : 'Iniciar Produção'}
        description={
          pendingAction?.type === 'delete'
            ? 'Tem certeza que deseja excluir esta tarefa? Esta ação é irreversível.'
            : 'Deseja iniciar a produção desta demanda? Esta ação não pode ser desfeita.'
        }
        confirmText={pendingAction?.type === 'delete' ? 'Excluir' : 'Confirmar'}
        variant={pendingAction?.type === 'delete' ? 'danger' : 'info'}
      />
    </div>
  );
}