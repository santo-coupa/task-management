import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

import { TaskService } from '../../core/services/task.service';
import { CreateTaskRequest } from '../../core/models/create-task-request.model';
import { UpdateTaskRequest } from '../../core/models/update-task-request.model'; // create this
import { UserTask } from '../../core/models/task.model';
import { UserTaskStatus } from '../../core/models/task-status.enum';

@Component({
  standalone: true,
  selector: 'app-create-task-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    SelectModule,
  ],
  templateUrl: './create-task-modal.component.html',
  styleUrl: './create-task-modal.component.scss',
})
export class CreateTaskModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  taskToEdit: UserTask | null = null;
  isEditMode = false;

  readonly statusOptions = [
    { label: 'Pending', value: UserTaskStatus.pending },
    { label: 'In Progress', value: UserTaskStatus.inprogress },
    { label: 'Completed', value: UserTaskStatus.completed },
    { label: 'Cancelled', value: UserTaskStatus.cancelled },
  ];

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    assigneeId: [''],
    status: [UserTaskStatus.pending],
    dueDate: [null],
  });

  users: any[] = [];

  ngOnInit(): void {
    this.taskToEdit = this.config.data?.task ?? null;
    this.isEditMode = !!this.taskToEdit;

    if (this.isEditMode && this.taskToEdit) {
      this.form.patchValue({
        name: this.taskToEdit.title,
        assigneeId: this.taskToEdit.assignedToUserId || '',
        status: this.taskToEdit.status,
        description: '',
        dueDate: null,
      });
    }

    this.taskService.getUsers().subscribe((users) => {
      this.users = users
        .filter((u) => u.isActive)
        .map((u) => ({
          label: `${u.firstName} ${u.lastName}`,
          value: u.id,
        }));

      this.users.unshift({
        label: 'Unassigned',
        value: null,
      });
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    if (this.isEditMode && this.taskToEdit) {
      const updateRequest: UpdateTaskRequest = {
        name: value.name!,
        description: value.description || undefined,
        assigneeId: value.assigneeId || null,
        status: value.status!,
        dueDate: value.dueDate ? new Date(value.dueDate).toISOString() : undefined,
      };

      this.taskService.updateTask(this.taskToEdit.id, updateRequest).subscribe((updated) => {
        this.ref.close(updated);
      });
    } else {
      const createRequest: CreateTaskRequest = {
        name: value.name!,
        description: value.description || undefined,
        assigneeId: value.assigneeId || null,
        status: value.status!,
        dueDate: value.dueDate ? new Date(value.dueDate).toISOString() : undefined,
      };

      this.taskService.createTask(createRequest).subscribe((created) => {
        this.ref.close(created);
      });
    }
  }

  cancel(): void {
    this.ref.close();
  }
}
