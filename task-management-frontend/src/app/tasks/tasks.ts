import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';

import { UserTaskStatus } from '../core/models/task-status.enum';
import { TaskService } from '../core/services/task.service';
import { AuthService } from '../core/services/auth.service';
import { CreateTaskModalComponent } from './create-task-modal/create-task-modal.component';
import { UserTask } from '../core/models/task.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    TableModule,
    SelectModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DynamicDialogModule,
  ],
  providers: [DialogService],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class TasksComponent implements OnInit {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);

  readonly tasks$ = this.taskService.tasks$;
  readonly isAdmin$ = this.authService.isGlobalAdmin$;

  selectedStatus: UserTaskStatus | null = null;

  readonly statusOptions = [
    { label: 'All', value: null },
    { label: 'Pending', value: UserTaskStatus.pending },
    { label: 'In Progress', value: UserTaskStatus.inprogress },
    { label: 'Completed', value: UserTaskStatus.completed },
    { label: 'Cancelled', value: UserTaskStatus.cancelled },
  ];

  ngOnInit(): void {
    this.taskService.loadTasks();
  }

  openCreateTask(): void {
    const ref = this.dialogService.open(CreateTaskModalComponent, {
      header: 'Create Task',
      width: '450px',
      modal: true,
    });

    ref?.onClose.subscribe((createdTask) => {});
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe();
  }

  openEditTask(task: UserTask): void {
    const ref = this.dialogService.open(CreateTaskModalComponent, {
      header: 'Edit Task',
      width: '450px',
      modal: true,
      data: { task },
    });
    if(!ref) return;

    ref.onClose.subscribe(updatedTask =>{

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
