import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';

import { UserService } from '../../services/user.service';
import { SystemUser } from '../system-user.model';
import { CreateUserRequest } from '../create-user-request.model';
import { UpdateUserRequest } from '../update-user-request.model';
import { Role } from '../role.enum';

@Component({
  standalone: true,
  selector: 'app-create-edit-user-modal',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, CheckboxModule],
  templateUrl: './create-edit-user-modal.html',
  styleUrl: './create-edit-user-modal.scss',
})
export class CreateEditUserModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private UserService = inject(UserService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  userToEdit: SystemUser | null = null;
  isEditMode = false;

  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: [''],
    firstName: [''],
    lastName: [''],
    title: [''],
    isActive: [true],
  });

  ngOnInit(): void {
    this.userToEdit = this.config.data?.user ?? null;
    this.isEditMode = !!this.userToEdit;

    if (this.isEditMode && this.userToEdit) {
      this.form.patchValue({
        username: this.userToEdit.username,
        email: this.userToEdit.email,
        firstName: this.userToEdit.firstName,
        lastName: this.userToEdit.lastName,
        title: this.userToEdit.title,
        isActive: this.userToEdit.isActive,
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    if (this.isEditMode && this.userToEdit) {
      const updateRequest: UpdateUserRequest = {
        username: value.username!,
        email: value.email!,
        firstName: value.firstName || undefined,
        lastName: value.lastName || undefined,
        title: value.title || undefined,
        isActive: value.isActive!,
        password: value.password || undefined,
      };
      this.UserService.updateUser(this.userToEdit.id, updateRequest).subscribe((updated) =>
        this.ref.close(updated),
      );
    } else {
      const createRequest: CreateUserRequest = {
        username: value.username!,
        email: value.email!,
        password: value.password!,
        firstName: value.firstName || undefined,
        lastName: value.lastName || undefined,
        title: value.title || undefined,
        role: Role.USER,
        isActive: value.isActive!,
      };
      this.UserService.createUser(createRequest).subscribe((created) => this.ref.close(created));
    }
  }
  cancel(): void {
    this.ref.close();
  }
}
