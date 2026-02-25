import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';

import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { UserTaskStatus } from '../../core/models/task-status.enum';
import { CreateTaskRequest } from '../../core/models/create-task-request.model';

@Component({
  standalone: true,
  selector: 'app-create-task-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule
  ],
  templateUrl: './create-task-modal.component.html'
})
export class CreateTaskModalComponent {

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private ref = inject(DynamicDialogRef);

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    dueDate: [null]
  });

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.authService.getUser();
    if (!user) return;

    const value = this.form.value;

    const request: CreateTaskRequest = {
      name: value.name!,
      description: value.description || undefined,
      assignedUserId: user.id,
      status: UserTaskStatus.pending,
      dueDate: value.dueDate
        ? new Date(value.dueDate).toISOString()
        : undefined
    };

    this.taskService.createTask(request).subscribe((createdTask) => {
      this.ref.close(createdTask);
    });
  }

  cancel(): void {
    this.ref.close();
  }
}