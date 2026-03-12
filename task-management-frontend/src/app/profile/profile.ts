import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { BehaviorSubject, switchMap, tap } from 'rxjs';

import { ProfileService } from '../core/services/profile.services';
import { UpdateProfileRequest } from '../core/models/update-profile-request.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputTextModule, PasswordModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  private profileService = inject(ProfileService);

  private refresh$ = new BehaviorSubject<void>(undefined);

  editMode = false;
  errorMessage = '';

  editable = {
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    password: '',
    confirmPassword: '',
  };

  profile$ = this.refresh$.pipe(
    switchMap(() => this.profileService.getProfile()),
    tap((profile) => {
      this.editable.firstName = profile.firstName ?? '';
      this.editable.lastName = profile.lastName ?? '';
      this.editable.email = profile.email;
      this.editable.title = profile.title ?? '';
    }),
  );

  toggleEdit(): void {
    this.editMode = !this.editMode;
    this.errorMessage = '';
  }

  save(): void {
    if (this.editable.password !== this.editable.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    const request: UpdateProfileRequest = {
      firstName: this.editable.firstName,
      lastName: this.editable.lastName,
      email: this.editable.email,
      title: this.editable.title,
      password: this.editable.password || undefined,
    };

    this.profileService.updateProfile(request).subscribe(() => {
      this.editMode = false;
      this.editable.password = '';
      this.editable.confirmPassword = '';
      this.refresh$.next();
    });
  }
}
