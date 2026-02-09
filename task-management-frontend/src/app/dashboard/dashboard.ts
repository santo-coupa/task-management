import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskService } from '../core/services/task.service';
import { AuthService } from '../core/services/auth.service';
import { UserTaskStatus } from '../core/models/task-status.enum';
import { Role } from '../core/models/role.enum';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  totalTasks = 0;
  pendingTasks = 0;
  cancelledTasks = 0;
  inProgressTasks = 0;
  completedTasks = 0;

  isAdmin = false;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole(Role.ADMIN);
    this.totalTasks = this.taskService.getTotalTaskCount();
    this.inProgressTasks = this.taskService.getTaskCountByStatus(UserTaskStatus.inprogress);
    this.cancelledTasks = this.taskService.getTaskCountByStatus(UserTaskStatus.cancelled);
    this.completedTasks = this.taskService.getTaskCountByStatus(UserTaskStatus.completed);
    this.pendingTasks = this.taskService.getTaskCountByStatus(UserTaskStatus.pending);

  }
}
