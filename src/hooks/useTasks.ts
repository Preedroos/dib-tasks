import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
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
      const logId = crypto.randomUUID();
      const logRef = doc(db, 'task_logs', logId);
      await setDoc(logRef, {
        id: logId,
        user_id: profile.id,
        task_id: taskId,
        action,
        details,
        created_at: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Erro ao salvar log de auditoria:', err.message);
    }
  };

  useEffect(() => {
    if (!profile) {
      setTasks([]);
      return;
    }

    let q = query(collection(db, 'tasks'));

    if (profile.role === 'MANAGER' && profile.store_id) {
      q = query(q, where('store_ids', 'array-contains', profile.store_id));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const dataList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          description: data.description,
          priority: data.priority,
          status: data.status,
          due_date: data.due_date || null,
          note: data.note || null,
          created_by: data.created_by,
          created_at: data.created_at,
          archived_at: data.archived_at || null,
          store_ids: data.store_ids || []
        } as Tasks;
      });

      // Ordenar em memória por created_at descending
      dataList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setTasks(dataList);
    }, (err: any) => {
      console.error('Erro ao buscar tarefas em tempo real:', err.message);
    });

    return () => unsubscribe();
  }, [profile]);

  const executeMoveTask = async (taskId: string, newStatus: StatusType) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: newStatus
      });
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
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
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
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        archived_at: new Date().toISOString()
      });
      await saveLog(taskId, 'ARCHIVE', 'Tarefa arquivada');
    } catch (err: any) {
      alert('Erro ao arquivar tarefa: ' + err.message);
    }
  };

  const handleUnarchiveTask = async (taskId: string) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        archived_at: null
      });
      await saveLog(taskId, 'UPDATE', 'Tarefa desarquivada');
    } catch (err: any) {
      alert('Erro ao desarquivar tarefa: ' + err.message);
    }
  };

  // CORREÇÃO: Agora aceita um array opcional de storeIds vindo da tela do Admin/Marketing
  const handleAddTask = async (taskData: { 
    description: string; 
    dueDate: string; 
    priority: PriorityType; 
    storeIds?: string[]; 
  }) => {
    if (!profile) return;
    try {
      const newId = crypto.randomUUID();
      const taskRef = doc(db, 'tasks', newId);

      // Definição inteligente do escopo de lojas
      let finalStoreIds: string[] = [];
      if (profile.role === 'MANAGER' && profile.store_id) {
        finalStoreIds = [profile.store_id]; // Se for gerente, força a própria loja
      } else if (taskData.storeIds) {
        finalStoreIds = taskData.storeIds; // Se for Admin/Marketing, usa o que foi selecionado na tela
      }

      await setDoc(taskRef, {
        description: taskData.description,
        priority: taskData.priority,
        due_date: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
        status: 'PENDING' as StatusType,
        created_by: profile.id,
        store_ids: finalStoreIds,
        created_at: new Date().toISOString(),
        archived_at: null,
        note: null
      });

      await saveLog(newId, 'CREATE', 'Tarefa criada');
    } catch (err: any) {
      alert('Erro ao adicionar tarefa: ' + err.message);
    }
  };

  const handleUpdateNote = async (taskId: string, note: string) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { note });
      await saveLog(taskId, 'UPDATE', 'Nota administrativa atualizada');
    } catch (err: any) {
      alert('Erro ao atualizar nota: ' + err.message);
    }
  };

  const handleUpdateDueDate = async (taskId: string, newDate: string) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const calculatedPriority = calculatePriorityByDueDate(newDate);
      await updateDoc(taskRef, {
        due_date: newDate ? new Date(newDate).toISOString() : null,
        priority: calculatedPriority
      });
      await saveLog(taskId, 'UPDATE', 'Prazo de entrega alterado');
    } catch (err: any) {
      alert('Erro ao atualizar prazo: ' + err.message);
    }
  };

  const handleUpdateStores = async (taskId: string, storeIds: string[]) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        store_ids: storeIds
      });
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