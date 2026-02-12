import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/role.enum';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MenubarModule, MenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {

  menuItems: MenuItem[] = [];
  profileItems: MenuItem[] = [];

  displayName = '';
  userInitial = '';

  private currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();

    const email = this.currentUser?.email ?? 'User';
    this.displayName = email.split('@')[0];
    this.userInitial = this.displayName.charAt(0).toUpperCase();

    this.buildMenu();
    this.buildProfileMenu();
  }

  private buildMenu(): void {
    this.menuItems = [
      { label: 'Dashboard', routerLink: '/dashboard' },
      { label: 'Tasks', routerLink: '/tasks' },
    ];

    if (this.currentUser?.role === Role.ADMIN) {
      this.menuItems.push({
        label: 'Users',
        routerLink: '/users',
      });
    }
  }

  private buildProfileMenu(): void {
    const email = this.currentUser?.email ?? 'User';

    this.profileItems = [
      {
        label: email,
        disabled: true,
      },
      { separator: true },
      {
        label: 'My Profile',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/profile']),
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      },
    ];
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}