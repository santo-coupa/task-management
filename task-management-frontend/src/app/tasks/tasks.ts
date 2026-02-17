import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map, Observable } from 'rxjs';

import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { UserTask } from '../core/models/task.model';
import { UserTaskStatus } from '../core/models/task-status.enum';
import { TaskService } from '../core/services/task.service';
import { AuthService } from '../core/services/auth.service';
import { Role } from '../core/models/role.enum';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AsyncPipe,
    TableModule,
    SelectModule,
    ButtonModule,
    CardModule 
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class TasksComponent {

  private taskService = inject(TaskService);
  private authService = inject(AuthService);

  readonly tasks$ = this.taskService.getTasks();

  readonly isAdmin$: Observable<boolean> =
    this.authService.user$.pipe(
      map(user => user?.role === Role.ADMIN)
    );

  selectedStatus: UserTaskStatus | null = null;

  readonly statusOptions = [
    { label: 'All', value: null },
    { label: 'Pending', value: UserTaskStatus.pending },
    { label: 'In Progress', value: UserTaskStatus.inprogress },
    { label: 'Completed', value: UserTaskStatus.completed },
    { label: 'Cancelled', value: UserTaskStatus.cancelled },
  ];

  getStatusLabel(status: UserTaskStatus): string {
    return UserTaskStatus[status];
  }

  onGlobalFilter(event: Event, table: any) {
    const value = (event.target as HTMLInputElement).value;
    table.filterGlobal(value, 'contains');
  }

  onStatusFilter(value: any, table: any) {
    if (value === null) {
      table.clear();
    } else {
      table.filter(value, 'status', 'equals');
    }
  }
}