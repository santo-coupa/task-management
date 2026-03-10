import { UserTaskStatus } from "./task-status.enum";

export interface UpdateTaskRequest{
  name: string;
  description?: string;
  status?: UserTaskStatus;
  assigneeId?: string | null;
  dueDate?: string;
}