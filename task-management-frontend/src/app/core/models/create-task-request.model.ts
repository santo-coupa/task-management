import { UserTaskStatus } from './task-status.enum';

export interface CreateTaskRequest {
  name: string;
  description?: string;
  assigneeId?: string | null;
  assignedUserId?: string;
  dueDate?: string;
  status?: UserTaskStatus;
}