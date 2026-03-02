import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

import { UserService } from '../core/services/user.service';
import { SystemUser } from '../core/models/system-user.model';
import { CreateEditUserModalComponent } from '../core/models/users-model-component/create-edit-user.modal';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    DynamicDialogModule,
  ],
  providers: [ConfirmationService, DialogService],
  templateUrl: './users.html',
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private confirmationService = inject(ConfirmationService);
  private dialogService = inject(DialogService);

  readonly users$ = this.userService.users$;

  loading = false;

  ngOnInit(): void {
    this.loading = true;

    this.userService.loadUsers().subscribe({
      next: () => (this.loading = false),
      error: () => (this.loading = false),
    });
  }

  openCreate(): void {
    this.dialogService.open(CreateEditUserModalComponent, {
      header: 'Create User',
      width: '650px',
      modal: true,
    });
  }

  openEdit(user: SystemUser): void {
    this.dialogService.open(CreateEditUserModalComponent, {
      header: 'Edit User',
      width: '650px',
      modal: true,
      data: { user },
    });
  }

  deleteUser(id: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        this.userService.deleteUser(id).subscribe();
      },
    });
  }
}
