import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';

import { ProfileService } from '../../core/services/profile.services';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, PasswordModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePasswordComponent {
  private profileService = inject(ProfileService);
  router = inject(Router);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  errorMessage = '';

  updatePassword(): void {
    if (!this.currentPassword || !this.newPassword) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.profileService
      .updatePassword({
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
      })
      .subscribe(() => {
        this.router.navigate(['/profile']);
      });
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }
}
