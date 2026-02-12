import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/auth-response.model';
import { tap } from 'rxjs';
import { Role } from '../models/role.enum';

const STORAGE_KEY = 'auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  private readonly API_URL = 'http://localhost:5017/auth/authenticate';

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.API_URL, {
        username,
        password,
      })
      .pipe(
        tap((response: AuthResponse) => {
          this.token = response.token;

          this.user = {
            id: response.username,
            email: response.email,
            role: response.role,
          };

          localStorage.setItem('auth_token', this.token);
          localStorage.setItem('auth_user', JSON.stringify(this.user));
        }),
      );
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  hasRole(role: Role): boolean {
    return this.user?.role === role;
  }

  updateUser(updatedUser: User): void {
    this.user = updatedUser;
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  }

  private restoreSession(): void {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      this.token = storedToken;
      this.user = JSON.parse(storedUser);
    }
  }
}
