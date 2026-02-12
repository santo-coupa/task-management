import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/auth-response.model';
import { User } from '../models/user.model';
import { Role } from '../models/role.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly API_URL = 'http://localhost:5017/auth/authenticate';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private token: string | null = null;

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.API_URL, {
      username,
      password,
    }).pipe(
      tap((response) => {

        const user: User = {
          id: response.username,
          email: response.email,
          role: response.role,
        };

        this.token = response.token;
        this.userSubject.next(user);

        localStorage.setItem(this.TOKEN_KEY, this.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      })
    );
  }

  logout(): void {
    this.token = null;
    this.userSubject.next(null);

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  getToken(): string | null {
    return this.token;
  }

  hasRole(role: Role): boolean {
    return this.userSubject.value?.role === role;
  }

  updateUser(updatedUser: User): void {
    this.userSubject.next(updatedUser);
    localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
  }

  private restoreSession(): void {
    const storedToken = localStorage.getItem(this.TOKEN_KEY);
    const storedUser = localStorage.getItem(this.USER_KEY);

    if (storedToken && storedUser) {
      this.token = storedToken;
      this.userSubject.next(JSON.parse(storedUser));
    }
  }
}