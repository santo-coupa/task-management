import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

import { BehaviorSubject, switchMap, tap } from 'rxjs';

import { ProfileService } from '../core/services/profile.services';
import { UpdateProfileRequest } from '../core/models/update-profile-request.model';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputTextModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);

  private refresh$ = new BehaviorSubject<void>(undefined);

  editMode = false;
  errorMessage = '';

  editable = {
    firstName: '',
    lastName: '',
    email: '',
    title: '',
  };

  profile$ = this.refresh$.pipe(
    switchMap(() => this.profileService.getProfile()),
    tap((profile) => {
      this.editable.firstName = profile.firstName ?? '';
      this.editable.lastName = profile.lastName ?? '';
      this.editable.email = profile.email;
      this.editable.title = profile.title ?? '';

      const currentUser = this.authService.getUser();

      if (currentUser) {
        this.authService.updateUser({
          ...currentUser,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
        });
      }
    }),
  );

  toggleEdit(): void {
    this.editMode = !this.editMode;
    this.errorMessage = '';
  }

  save(): void {
    const request: UpdateProfileRequest = {
      firstName: this.editable.firstName,
      lastName: this.editable.lastName,
      email: this.editable.email,
      title: this.editable.title,
    };

    this.profileService.updateProfile(request).subscribe(() => {
      this.editMode = false;
      this.refresh$.next();
    });
  }
}
