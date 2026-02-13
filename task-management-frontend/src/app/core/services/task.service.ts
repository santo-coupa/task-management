import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

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
  private authService = inject(AuthService);

  private tasksSubject = new BehaviorSubject<UserTask[]>(MOCK_TASKS);

  readonly tasks$ = this.tasksSubject.asObservable();

  readonly userTasks$: Observable<UserTask[]> = combineLatest([
    this.tasks$,
    this.authService.user$,
  ]).pipe(
    map(([tasks, user]) => {
      if (!user) return [];

      if (user.role === Role.ADMIN) {
        return tasks;
      }

      return tasks.filter((task) => task.assignedToUserId === user.id);
    }),
  );
}
