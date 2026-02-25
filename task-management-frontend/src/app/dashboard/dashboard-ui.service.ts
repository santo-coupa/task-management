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
  providedIn: 'root',
})
export class DashboardUiService {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);

  readonly vm$: Observable<DashboardVm> = combineLatest([
    this.taskService.tasks$,
    this.authService.isGlobalAdmin$,
  ]).pipe(
    map(([tasks, isAdmin]) => {
      const stats = tasks.reduce(
        (acc, task) => {
          acc.totalTasks++;

          switch (task.status) {
            case UserTaskStatus.pending:
              acc.pendingTasks++;
              break;

            case UserTaskStatus.inprogress:
              acc.inProgressTasks++;
              break;

            case UserTaskStatus.completed:
              acc.completedTasks++;
              break;

            case UserTaskStatus.cancelled:
              acc.cancelledTasks++;
              break;
          }

          return acc;
        },
        {
          totalTasks: 0,
          pendingTasks: 0,
          cancelledTasks: 0,
          inProgressTasks: 0,
          completedTasks: 0,
        },
      );

      return {
        ...stats,
        isAdmin,
      };
    }),
  );
}
