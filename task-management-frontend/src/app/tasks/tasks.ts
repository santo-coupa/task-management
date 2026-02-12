import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';

import { UserTaskStatus } from '../core/models/task-status.enum';
import { TaskService } from '../core/services/task.service';
import { AuthService } from '../core/services/auth.service';
import { Role } from '../core/models/role.enum';
import { map } from 'rxjs';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, SelectModule, AsyncPipe],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class TasksComponent {
onGlobalFilter($event: Event) {
throw new Error('Method not implemented.');
}

  tasks$;
  isAdmin$;

  selectedStatus: UserTaskStatus | null = null;

  statusOptions = [
    { label: 'All', value: null },
    { label: 'Pending', value: UserTaskStatus.pending },
    { label: 'In Progress', value: UserTaskStatus.inprogress },
    { label: 'Completed', value: UserTaskStatus.completed },
    { label: 'Cancelled', value: UserTaskStatus.cancelled },
  ];

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
  ) {
    this.tasks$ = this.taskService.userTasks$;

    this.isAdmin$ = this.authService.user$.pipe(
      map(user => user?.role === Role.ADMIN)
    );
  }

  getStatusLabel(status: UserTaskStatus): string {
    return UserTaskStatus[status];
  }
}