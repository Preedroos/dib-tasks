import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { taskService } from '../services/taskService';
import { calculatePriorityByDueDate } from '../helpers/priority';
import type { StatusType, PriorityType, Tasks, AuditType } from '../types';

export interface PendingAction {
  type: 'move' | 'delete';
  taskId: string;
  nextStatus?: StatusType;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const { profile } = useAuth();

  const saveLog = async (taskId: string, action: AuditType, details: string) => {
    if (!profile) return;
    try {
      await taskService.saveLog(taskId, profile.id, action, details);
    } catch (err: any) {
      console.error('Erro ao salvar log de auditoria:', err.message);
    }
  };

  useEffect(() => {
    if (!profile) {
      setTasks([]);
      return;
    }

    const unsubscribe = taskService.subscribeTasks(
      profile,
      (dataList) => {
        dataList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setTasks(dataList);
      },
      (err) => {
        console.error('Erro ao buscar tarefas em tempo real:', err.message);
      }
    );

    return () => unsubscribe();
  }, [profile]);

  const executeMoveTask = async (taskId: string, newStatus: StatusType) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      await saveLog(taskId, 'MOVE', `Status alterado para ${newStatus}`);
    } catch (err: any) {
      alert('Erro ao mover tarefa: ' + err.message);
    }
  };

  const handleMoveTask = (taskId: string, newStatus: StatusType) => {
    const currentTask = tasks.find((t) => t.id === taskId);
    if (currentTask?.status === "PENDING") {
      setPendingAction({ type: 'move', taskId, nextStatus: newStatus });
    } else {
      executeMoveTask(taskId, newStatus);
    }
  };

  const executeDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      await saveLog(taskId, 'DELETE', 'Tarefa excluída');
    } catch (err: any) {
      alert('Erro ao excluir tarefa: ' + err.message);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setPendingAction({ type: 'delete', taskId });
  };

  const handleArchiveTask = async (taskId: string) => {
    try {
      await taskService.archiveTask(taskId, true);
      await saveLog(taskId, 'ARCHIVE', 'Tarefa arquivada');
    } catch (err: any) {
      alert('Erro ao arquivar tarefa: ' + err.message);
    }
  };

  const handleUnarchiveTask = async (taskId: string) => {
    try {
      await taskService.archiveTask(taskId, false);
      await saveLog(taskId, 'UPDATE', 'Tarefa desarquivada');
    } catch (err: any) {
      alert('Erro ao desarquivar tarefa: ' + err.message);
    }
  };

  const handleAddTask = async (taskData: {
    title: string;
    description: string;
    dueDate: string;
    priority: PriorityType;
    storeIds?: string[];
  }) => {
    try {
      await taskService.addTask(taskData);
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
    }
  };

  const handleUpdateNote = async (taskId: string, note: string) => {
    try {
      await taskService.updateTaskNote(taskId, note);
      await saveLog(taskId, 'UPDATE', 'Nota administrativa atualizada');
    } catch (err: any) {
      alert('Erro ao atualizar nota: ' + err.message);
    }
  };

  const handleUpdateDueDate = async (taskId: string, newDate: string) => {
    try {
      const calculatedPriority = calculatePriorityByDueDate(newDate);
      await taskService.updateTaskDueDate(taskId, newDate, calculatedPriority);
      await saveLog(taskId, 'UPDATE', 'Prazo de entrega alterado');
    } catch (err: any) {
      alert('Erro ao atualizar prazo: ' + err.message);
    }
  };

  const handleUpdateStores = async (taskId: string, storeIds: string[]) => {
    try {
      await taskService.updateTaskStores(taskId, storeIds);
      await saveLog(taskId, 'UPDATE', 'Lojas vinculadas alteradas');
    } catch (err: any) {
      alert('Erro ao atualizar lojas vinculadas: ' + err.message);
    }
  };

  const confirmPendingAction = async () => {
    if (!pendingAction) return;
    if (pendingAction.type === 'move' && pendingAction.nextStatus) {
      await executeMoveTask(pendingAction.taskId, pendingAction.nextStatus);
    } else if (pendingAction.type === 'delete') {
      await executeDeleteTask(pendingAction.taskId);
    }
    setPendingAction(null);
  };

  const cancelPendingAction = () => {
    setPendingAction(null);
  };

  const activeTasks = tasks.filter((t) => t.archived_at === null);
  const archivedTasks = tasks.filter((t) => t.archived_at !== null);

  const pendingTasks = activeTasks.filter((t) => t.status === 'PENDING');
  const inProgressTasks = activeTasks.filter((t) => t.status === 'IN_PROGRESS');
  const doneTasks = activeTasks.filter((t) => t.status === 'DONE');

  return {
    tasks,
    pendingAction,
    activeTasks,
    archivedTasks,
    pendingTasks,
    inProgressTasks,
    doneTasks,
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
  };
}