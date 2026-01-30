import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { dashboardRoutes } from './dashboard/dashboard.routes';
import { authGuard } from './core/guards/auth.guard';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout';
import { tasksRoutes } from './tasks/tasks.routes';
import { usersRoutes } from './users/users.routes';


export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [authGuard],
    children: [
      ...dashboardRoutes,
      ...tasksRoutes,
      ...usersRoutes,
    ],
  },
];
