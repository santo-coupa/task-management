import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { InputTextModule } from 'primeng/inputtext'

import { ProfileService } from '../core/services/profile.service'
import { AuthService } from '../core/services/auth.service'
import { UpdateProfileRequest } from '../core/models/update-profile-request.model'
import { User } from '../core/models/user.model'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {

  private profileService = inject(ProfileService)
  private authService = inject(AuthService)

  user: User | null = null

  editMode = false

  editable = {
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    password: ''
  }

  ngOnInit(): void {
    this.loadProfile()
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe(profile => {

      this.user = {
        id: profile.id,
        email: profile.email,
        role: profile.role
      }

      this.editable.firstName = profile.firstName ?? ''
      this.editable.lastName = profile.lastName ?? ''
      this.editable.email = profile.email
      this.editable.title = profile.title ?? ''
    })
  }

  toggleEdit(): void {
    this.editMode = !this.editMode
  }

  save(): void {

    const request: UpdateProfileRequest = {
      firstName: this.editable.firstName,
      lastName: this.editable.lastName,
      email: this.editable.email,
      title: this.editable.title,
      password: this.editable.password || undefined
    }

    this.profileService.updateProfile(request).subscribe(updated => {

      this.authService.updateUser({
        id: updated.id,
        email: updated.email,
        role: updated.role
      })

      this.editMode = false
      this.loadProfile()
    })
  }

}