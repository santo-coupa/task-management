import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { authGuard } from './core/guards/auth.guard';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout';

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
        loadChildren: () => import('./tasks/tasks.routes').then((m) => m.tasksRoutes),
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.routes').then((m) => m.usersRoutes),
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'auth',
  },
];
