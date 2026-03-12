import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/role.enum';
import { map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MenubarModule, MenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly user$ = this.authService.user$;

  readonly menuItems$ = this.user$.pipe(
    map((user) => {
      const items: MenuItem[] = [
        { label: 'Dashboard', routerLink: '/dashboard' },
        { label: 'Tasks', routerLink: '/tasks' },
      ];

      if (user?.role === Role.ADMIN) {
        items.push({
          label: 'Users',
          routerLink: '/users',
        });
      }

      return items;
    }),
  );

  readonly profileItems: MenuItem[] = [
    {
      label: 'My Profile',
      icon: 'pi pi-user',
      command: () => this.router.navigate(['/profile']),
    },
    {
      label: 'Change Password',
      icon: 'pi pi-lock',
      command: () => this.router.navigate(['/profile/password']),
    },
    { separator: true },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout(),
    },
  ];

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getDisplayName(user: any): string {
    if (user?.firstName || user?.lastName) {
      return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
    }

    return user?.username ?? 'User';
  }
}
