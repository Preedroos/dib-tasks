export type PriorityType = "LOW" | "MEDIUM" | "HIGH";
export type StatusType = "PENDING" | "IN_PROGRESS" | "DONE";
export type RoleType = "ADMIN" | "MANAGER" | "MARKETING";
export type AuditType = "CREATE" | "UPDATE" | "DELETE" | "MOVE" | "ARCHIVE";

export interface Tasks {
  id: string;
  title: string;
  description: string;
  priority: PriorityType;
  status: StatusType;
  due_date: string | null;
  note?: string | null;
  created_by: string;
  created_at: string;
  archived_at: string | null;
  store_ids: string[];
}

export interface LogTasks {
  id: string;
  user_id: string;
  task_id: string;
  action: AuditType;
  details: string;
  created_at: string;
}

export interface Users {
  id: string; // Deve ser exatamente o uid do Firebase Auth
  name: string;
  email: string;
  role: RoleType;
  store_id: string | null; // Nulo para ADMIN e MARKETING, preenchido para MANAGER
  created_at: string;
}

export interface Stores {
  id: string; // ID do documento da loja
  name: string;
  city?: string;
  created_at: string;
}