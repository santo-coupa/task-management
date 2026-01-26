import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUser } from '../models/auth-user.model';

const STORAGE_KEY = 'auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  /**
   * Holds the current authenticated user
   * - null → not logged in
   * - AuthUser → logged in
   */
  private userSubject = new BehaviorSubject<AuthUser | null>(
    this.getUserFromStorage()
  );

  /**
   * Public observable for components to subscribe to
   */
  user$: Observable<AuthUser | null> = this.userSubject.asObservable();

  constructor() {}

  // ---------------------------------------------------------------------------
  // AUTH STATE
  // ---------------------------------------------------------------------------

  /**
   * Synchronous auth check
   * Used mainly by route guards
   */
  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }

  /**
   * Returns current user value (if needed)
   */
  getCurrentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  // ---------------------------------------------------------------------------
  // LOGIN / LOGOUT
  // ---------------------------------------------------------------------------

  /**
   * Fake login method
   * Normally this would call an HTTP API
   */
  login(email: string, password: string): Observable<AuthUser> {

    // 🔴 Fake credentials check
    if (email !== 'test@test.com' || password !== '1234') {
      throw new Error('Invalid credentials');
    }

    // 🟢 Fake user returned from backend
    const user: AuthUser = {
      id: '1',
      email,
      token: 'fake-jwt-token',
    };

    // Save user
    this.setUser(user);

    return new BehaviorSubject(user).asObservable();
  }

  /**
   * Logs user out
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.userSubject.next(null);
  }

  // ---------------------------------------------------------------------------
  // STORAGE
  // ---------------------------------------------------------------------------

  /**
   * Save user to localStorage and update stream
   */
  private setUser(user: AuthUser): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this.userSubject.next(user);
  }

  /**
   * Load user from localStorage on app start
   */
  private getUserFromStorage(): AuthUser | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}
