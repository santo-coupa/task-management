import { Injectable, inject } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';

import { TaskService } from '../core/services/task.service';
import { AuthService } from '../core/services/auth.service';
import { UserTaskStatus } from '../core/models/task-status.enum';

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

  readonly vm$ = this.taskService.tasks$.pipe(
    map((tasks) => {
      const stats = tasks.reduce(
        (acc, task) => {
          acc.totalTasks++;

          switch (task.status) {
            case UserTaskStatus.pending:
              acc.pendingTasks++;
              break;
            case UserTaskStatus.completed:
              acc.completedTasks++;
              break;
            case UserTaskStatus.inprogress:
              acc.inProgressTasks++;
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
          completedTasks: 0,
          inProgressTasks: 0,
          cancelledTasks: 0,
        },
      );

      return {
        ...stats,
        isAdmin: false,
      };
    }),
  );
}
