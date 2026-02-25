import { UserTaskStatus } from './task-status.enum';

export interface CreateTaskRequest {
  name: string;
  description?: string;
  assigneeId?: string;
  assignedUserId?: string;
  dueDate?: string;
  status?: UserTaskStatus;
}