import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { User } from '../core/models/user.model';
import { AuthService } from '../core/services/auth.service';

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
  styleUrl: './profile.scss',
})

export class ProfileComponent implements OnInit {
  user: User | null = null;
  editableEmail = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.editableEmail = this.user?.email ?? '';
  }

  save(): void {
    if (!this.user) return;

    this.authService.updateUser({
      ...this.user,
      email: this.editableEmail
    });

    this.user = this.authService.getUser();
  }

  resetPassword(): void {
    alert('Password reset link sent');
  }
}