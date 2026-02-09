import { Injectable } from '@angular/core';
import { UserTask } from '../models/task.model';
import { UserTaskStatus } from '../models/task-status.enum';
import { AuthService } from './auth.service';
import { Role } from '../models/role.enum';

const MOCK_TASKS: UserTask[] = [
  {
    id: 't1',
    title: 'Design login UI',
    status: UserTaskStatus.cancelled,
    assignedToUserId: '1',
  },
  {
    id: 't2',
    title: 'Implement role guard',
    status: UserTaskStatus.completed,
    assignedToUserId: '1',
  },
  {
    id: 't3',
    title: 'Review dashboard PR',
    status: UserTaskStatus.inprogress,
    assignedToUserId: '2',
  },
  {
    id: 't4',
    title: 'Create task list UI',
    status: UserTaskStatus.pending,
    assignedToUserId: '2',
  },
];

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private authService: AuthService) {}

  getTasks(): UserTask[] {
    const user = this.authService.getUser();

    if (!user) {
      return [];
    }

    if (user.role === Role.ADMIN) {
      return MOCK_TASKS;
    }

    return MOCK_TASKS.filter(
      task => task.assignedToUserId === user.id
    );
  }

  getTotalTaskCount(): number {
    return this.getTasks().length;
  }

  getTaskCountByStatus(status: UserTaskStatus): number {
    return this.getTasks().filter(
      task => task.status === status
    ).length;
  }
}