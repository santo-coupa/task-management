import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard';
import { tasksResolver } from '../core/resolvers/tasks.resolver';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: {
      tasksLoaded: tasksResolver
    }
  }
];