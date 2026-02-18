import { UserTaskStatus } from './task-status.enum';

export interface CreateTaskRequest {
  name: string;
  description?: string;
  assigneeId?: string;
  dueDate?: string;
}