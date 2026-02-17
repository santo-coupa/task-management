import { Injectable, inject } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';

import { TaskService } from '../core/services/task.service';
import { AuthService } from '../core/services/auth.service';
import { UserTaskStatus } from '../core/models/task-status.enum';
import { Role } from '../core/models/role.enum';

export interface DashboardVm {
  totalTasks: number;
  pendingTasks: number;
  cancelledTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  isAdmin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardUiService {

  private taskService = inject(TaskService);
  private authService = inject(AuthService);

  readonly vm$: Observable<DashboardVm> = combineLatest([
    this.taskService.tasks$,
    this.authService.user$
  ]).pipe(
    map(([tasks, user]) => ({
      totalTasks: tasks.length,
      pendingTasks: tasks.filter(t => t.status === UserTaskStatus.pending).length,
      cancelledTasks: tasks.filter(t => t.status === UserTaskStatus.cancelled).length,
      inProgressTasks: tasks.filter(t => t.status === UserTaskStatus.inprogress).length,
      completedTasks: tasks.filter(t => t.status === UserTaskStatus.completed).length,
      isAdmin: user?.role === Role.ADMIN
    }))
  );
}