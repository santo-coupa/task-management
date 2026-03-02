import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  templateUrl: './users.html'
})
export class UsersComponent implements OnInit {

  private userService = inject(UserService);
  private confirmationService = inject(ConfirmationService);

  readonly users$ = this.userService.users$;

  loading = false;

  ngOnInit(): void {
    this.loading = true;

    this.userService.loadUsers().subscribe({
      next: () => this.loading = false,
      error: () => this.loading = false
    });
  }

  deleteUser(id: string): void {

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        this.userService.deleteUser(id).subscribe();
      }
    });
  }
}