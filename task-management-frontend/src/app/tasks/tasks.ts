import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';

import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';

import { UserTaskStatus } from '../core/models/task-status.enum';
import { TaskService } from '../core/services/task.service';
import { AuthService } from '../core/services/auth.service';
import { Role } from '../core/models/role.enum';
import { CreateTaskRequest } from '../core/models/create-task-request.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    SelectModule,
    ButtonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    DatePickerModule,
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class TasksComponent implements OnInit {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  readonly tasks$ = this.taskService.tasks$;

  readonly isAdmin$: Observable<boolean> = this.authService.user$.pipe(
    map((user) => user?.role === Role.ADMIN),
  );

  showDialog = false;

  selectedStatus: UserTaskStatus | null = null;

  readonly statusOptions = [
    { label: 'All', value: null },
    { label: 'Pending', value: UserTaskStatus.pending },
    { label: 'In Progress', value: UserTaskStatus.inprogress },
    { label: 'Completed', value: UserTaskStatus.completed },
    { label: 'Cancelled', value: UserTaskStatus.cancelled },
  ];

  taskForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    assigneeId: [''],
    dueDate: [null],
  });

  ngOnInit(): void {
    this.taskService.loadTasks();
  }

  openDialog(): void {
    this.showDialog = true;
  }

  createTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const form = this.taskForm.value;

    const request: CreateTaskRequest = {
      name: form.name!,
      description: form.description || undefined,
      assigneeId: form.assigneeId || undefined,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
    };

    this.taskService.createTask(request).subscribe({
      next: () => {
        this.showDialog = false;
        this.taskForm.reset();
      },
    });
  }

  getStatusLabel(status: UserTaskStatus): string {
    return UserTaskStatus[status];
  }

  onGlobalFilter(event: Event, table: any): void {
    const value = (event.target as HTMLInputElement).value;
    table.filterGlobal(value, 'contains');
  }

  onStatusFilter(value: UserTaskStatus | null, table: any): void {
    if (value === null) {
      table.clear();
    } else {
      table.filter(value, 'status', 'equals');
    }
  }
}
