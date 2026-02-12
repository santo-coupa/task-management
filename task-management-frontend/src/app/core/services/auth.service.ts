import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Role } from '../models/role.enum';

const STORAGE_KEY = 'auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: User | null = null;

  constructor() {
    this.restoreUser();
  }

  login(email: string, password: string): boolean {
    this.user = {
      id: '1',
      email,
      role: email.includes('admin') ? Role.ADMIN : Role.USER,
    };

    this.persistUser();
    return true;
  }

  logout(): void {
    this.user = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  getUser(): User | null {
    return this.user;
  }

  hasRole(role: Role): boolean {
    return this.user?.role === role;
  }

  updateUser(updatedUser : User){
    this.user = updatedUser;
    this.persistUser();
  }

  private persistUser(): void {
    if (this.user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.user));
    }
  }

  private restoreUser(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      this.user = JSON.parse(stored);
    }
  }
}
