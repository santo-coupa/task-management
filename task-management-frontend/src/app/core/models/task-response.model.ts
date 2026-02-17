export interface TaskResponse{
  id: string;
  name: string;
  description?: string;
  status: number;
  assigneeId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
}