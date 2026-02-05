import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },

  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
      },
      {
        path: 'tasks',
        canActivate: [roleGuard],
        data: {roles : ['ADMIN', 'USER']},
        loadChildren: () => import('./tasks/tasks.routes').then((m) => m.tasksRoutes),
      },
      {
        path: 'users',
        canActivate: [roleGuard],
        data: {roles : ['ADMIN']},
        loadChildren: () => import('./users/users.routes').then((m) => m.usersRoutes),
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'auth',
  },
];
