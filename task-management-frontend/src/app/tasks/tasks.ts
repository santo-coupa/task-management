import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';

import { UserTask} from '../core/models/task.model';
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
    TableModule,
    SelectModule,
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class TasksComponent implements OnInit {
  tasks: UserTask[] = [];
  isAdmin = false;

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
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole(Role.ADMIN);
    this.tasks = this.taskService.getTasks();
  }

  getStatusLabel(status: UserTaskStatus): string {
    return UserTaskStatus[status];
  }
}