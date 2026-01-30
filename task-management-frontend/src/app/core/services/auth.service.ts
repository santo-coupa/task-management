import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: User | null = null;

  constructor() {}

  login(email: string, password: string): boolean {
    if (email && password) {
      this.user = {
        id: '1',
        email: email,
      };
      return true;
    }
    return false;
  }

  logout(): void {
    this.user = null;
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

  getUser(): User | null {
    return this.user;
  }
}
