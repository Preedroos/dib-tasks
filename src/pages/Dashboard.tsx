import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { TaskCreate } from '../components/TaskCreate';
import { TaskDetailsModal } from '../components/TaskDetailsModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useTasks } from '../hooks/useTasks';
import { useStores } from '../hooks/useStores';
import { useAuth } from '../contexts/AuthContext';
import { DashboardPresenter } from './DashboardPresenter';
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

  const header = (
    <Header
      actionIcon="settings_account_box"
      showActionButton={profile?.role === 'ADMIN'}
      onActionClick={() => {
        navigate('/usermanagement');
      }}
      onLogout={logout}
    />
  );

  const floatingActionButton = (
    <FloatingActionButton icon="add" onClick={() => setIsTaskCreateOpen(true)} />
  );

  const createModal = (
    <TaskCreate
      isOpen={isTaskCreateOpen}
      onClose={() => setIsTaskCreateOpen(false)}
      onAddTask={handleAddTask}
      availableStores={stores}
    />
  );

  const detailsModal = (
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
  );

  const confirmationModal = (
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
  );

  return (
    <DashboardPresenter
      header={header}
      activeStatus={activeStatus}
      setActiveStatus={setActiveStatus}
      pendingTasks={pendingTasks}
      inProgressTasks={inProgressTasks}
      doneTasks={doneTasks}
      archivedTasks={archivedTasks}
      handleMoveTask={handleMoveTask}
      handleDeleteTask={handleDeleteTask}
      handleArchiveTask={handleArchiveTask}
      handleUnarchiveTask={handleUnarchiveTask}
      setSelectedTask={setSelectedTask}
      floatingActionButton={floatingActionButton}
      createModal={createModal}
      detailsModal={detailsModal}
      confirmationModal={confirmationModal}
    />
  );
}