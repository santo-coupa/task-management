import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ProfileService } from '../core/services/profile.services';
import { Profile } from '../core/models/profile.model';
import { UpdateProfileRequest } from '../core/models/update-profile-request.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputTextModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);

  profile: Profile | null = null;

  editMode = false;

  editable = {
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    password: '',
  };

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe((profile) => {
      this.profile = profile;
      this.editable.firstName = profile.firstName ?? '';
      this.editable.lastName = profile.lastName ?? '';
      this.editable.email = profile.email;
      this.editable.title = profile.title ?? '';
    });
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
  }

  save(): void {
    const request: UpdateProfileRequest = {
      firstName: this.editable.firstName,
      lastName: this.editable.lastName,
      email: this.editable.email,
      title: this.editable.title,
      password: this.editable.password || undefined,
    };

    this.profileService.updateProfile(request).subscribe((updated) => {
      this.profile = updated;
      this.editMode = false;
    });
  }
}
