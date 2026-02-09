import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';

import { UserTask } from '../core/models/task.model';
import { TaskService } from '../core/services/task.service';
import { AuthService } from '../core/services/auth.service';
import { Role } from '../core/models/role.enum';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class TasksComponent implements OnInit {
  tasks: UserTask[] = [];
  isAdmin = false;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole(Role.ADMIN);
    this.tasks = this.taskService.getTasks();
  }
}
