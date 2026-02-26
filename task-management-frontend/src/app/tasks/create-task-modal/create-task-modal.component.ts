import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';

import { TaskService } from '../../core/services/task.service';
import { CreateTaskRequest } from '../../core/models/create-task-request.model';
import { UpdateTaskRequest } from '../../core/models/update-task-request.model'; // create this
import { UserTask } from '../../core/models/task.model';

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
  templateUrl: './create-task-modal.component.html',
  styleUrl: './create-task-modal.component.scss'
})
export class CreateTaskModalComponent implements OnInit {

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  taskToEdit: UserTask | null = null;
  isEditMode = false;

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    assigneeId: [''],
    dueDate: [null]
  });

  ngOnInit(): void {
    this.taskToEdit = this.config.data?.task ?? null;
    this.isEditMode = !!this.taskToEdit;

    if (this.isEditMode && this.taskToEdit) {
      this.form.patchValue({
        name: this.taskToEdit.title,
        assigneeId: this.taskToEdit.assignedToUserId || '',
        description: '',
        dueDate: null
      });
    }
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
        assigneeId: value.assigneeId || undefined,
        dueDate: value.dueDate
          ? new Date(value.dueDate).toISOString()
          : undefined
      };

      this.taskService.updateTask(this.taskToEdit.id, updateRequest)
        .subscribe(updated => {
          this.ref.close(updated);
        });

    } else {

      const createRequest: CreateTaskRequest = {
        name: value.name!,
        description: value.description || undefined,
        assigneeId: value.assigneeId || undefined,
        dueDate: value.dueDate
          ? new Date(value.dueDate).toISOString()
          : undefined
      };

      this.taskService.createTask(createRequest)
        .subscribe(created => {
          this.ref.close(created);
        });
    }
  }

  cancel(): void {
    this.ref.close();
  }
}