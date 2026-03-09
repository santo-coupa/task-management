import { Injectable, inject } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';

import { TaskService } from '../core/services/task.service';
import { AuthService } from '../core/services/auth.service';

import { UserTask } from '../core/models/task.model';
import { UserTaskStatus } from '../core/models/task-status.enum';

export interface DashboardVm {
  totalTasks: number;
  pendingTasks: number;
  cancelledTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  isAdmin: boolean;
  recentTasks: UserTask[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardUiService {

  private taskService = inject(TaskService);
  private authService = inject(AuthService);

  readonly vm$: Observable<DashboardVm> =
    combineLatest([
      this.taskService.tasks$,
      this.authService.isGlobalAdmin$
    ]).pipe(
      map(([tasks, isAdmin]) => {

        const stats = {
          totalTasks: 0,
          pendingTasks: 0,
          cancelledTasks: 0,
          inProgressTasks: 0,
          completedTasks: 0
        };

        for (const task of tasks) {

          stats.totalTasks++;

          switch (task.status) {

            case UserTaskStatus.pending:
              stats.pendingTasks++;
              break;

            case UserTaskStatus.inprogress:
              stats.inProgressTasks++;
              break;

            case UserTaskStatus.completed:
              stats.completedTasks++;
              break;

            case UserTaskStatus.cancelled:
              stats.cancelledTasks++;
              break;
          }
        }

        const recentTasks = [...tasks].slice(-5).reverse();

        return {
          ...stats,
          isAdmin,
          recentTasks
        };
      })
    );
}