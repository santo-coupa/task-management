import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MenubarModule, MenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  menuItems: MenuItem[];
  profileItems: MenuItem[];
  userInitial: string;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    const email = this.authService.getUser()?.email ?? 'User';
    this.userInitial = email.charAt(0).toUpperCase();

    this.menuItems = [
      { label: 'Dashboard', routerLink: '/dashboard' },
      { label: 'Tasks', routerLink: '/tasks' },
      { label: 'Users', routerLink: '/users' },
    ];

    this.profileItems = [
      { label: email, disabled: true },
      { separator: true },
      {
        label: 'Logout',
        command: () => this.logout(),
      },
    ];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  get displayName(): string {
    const email = this.authService.getUser()?.email ?? 'User';
    return email.split('@')[0]; // "santosh.yadav"
  }
}
