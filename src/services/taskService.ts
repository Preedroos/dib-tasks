import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  addDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Tasks, StatusType, PriorityType, AuditType } from '../types';

export const taskService = {
  subscribeTasks(
    profile: { role: string; store_id: string | null },
    onTasksUpdate: (tasks: Tasks[]) => void,
    onError: (err: any) => void
  ): () => void {
    let q = query(collection(db, 'tasks'));

    if (profile.role === 'MANAGER' && profile.store_id) {
      q = query(q, where('store_ids', 'array-contains', profile.store_id));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const dataList = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || '',
          description: data.description || '',
          priority: data.priority || 'LOW',
          status: data.status || 'PENDING',
          due_date: data.due_date || null,
          note: data.note || null,
          created_by: data.created_by || '',
          created_at: data.created_at || new Date().toISOString(),
          archived_at: data.archived_at || null,
          store_ids: data.store_ids || []
        } as Tasks;
      });
      onTasksUpdate(dataList);
    }, (err) => {
      onError(err);
    });

    return unsubscribe;
  },

  async saveLog(taskId: string, userId: string, action: AuditType, details: string): Promise<void> {
    const logId = crypto.randomUUID();
    const logRef = doc(db, 'task_logs', logId);
    await setDoc(logRef, {
      id: logId,
      user_id: userId,
      task_id: taskId,
      action,
      details,
      created_at: new Date().toISOString()
    });
  },

  async updateTaskStatus(taskId: string, newStatus: StatusType): Promise<void> {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      status: newStatus
    });
  },

  async deleteTask(taskId: string): Promise<void> {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
  },

  async archiveTask(taskId: string, isArchived: boolean): Promise<void> {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      archived_at: isArchived ? new Date().toISOString() : null
    });
  },

  async addTask(taskData: {
    title: string;
    description: string;
    dueDate: string;
    priority: PriorityType;
    storeIds?: string[];
  }): Promise<void> {
    await addDoc(collection(db, 'tasks'), {
      title: taskData.title,
      description: taskData.description,
      due_date: taskData.dueDate,
      priority: taskData.priority,
      store_ids: taskData.storeIds || [],
      status: 'PENDING',
      created_at: new Date().toISOString()
    });
  },

  async updateTaskNote(taskId: string, note: string): Promise<void> {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, { note });
  },

  async updateTaskDueDate(taskId: string, newDate: string, calculatedPriority: PriorityType): Promise<void> {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      due_date: newDate ? new Date(newDate).toISOString() : null,
      priority: calculatedPriority
    });
  },

  async updateTaskStores(taskId: string, storeIds: string[]): Promise<void> {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      store_ids: storeIds
    });
  }
};
