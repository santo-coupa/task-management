import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { dashboardRoutes } from './dashboard/dashboard.routes';

export const routes: Routes = [
  ...authRoutes,
  ...dashboardRoutes,
];
