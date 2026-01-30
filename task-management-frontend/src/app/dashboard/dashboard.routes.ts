import { Routes } from "@angular/router";
import {DashboardComponent} from './dashboard';
import { authGuard } from "../core/guards/auth.guard";

export const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate : [authGuard],
  },
];