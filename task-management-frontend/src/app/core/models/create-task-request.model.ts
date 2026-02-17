export interface CreateTaskRequest {
  name: string;
  description?: string;
  assigneeId?: string | null;
  dueDate?: string | null;
}