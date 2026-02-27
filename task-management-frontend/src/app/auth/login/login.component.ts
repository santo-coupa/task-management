import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  NonNullableFormBuilder
} from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { AuthService } from '../../core/services/auth.service';
import { take } from 'rxjs';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private taskService = inject(TaskService);

  loading = false;
  errorMessage = '';

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  login(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.getRawValue();

    this.authService.login(username, password)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Invalid username or password';
        }
      });
  }
}