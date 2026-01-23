import { Routes } from '@angular/router';
import { LayoutComponent } from '@layout';
import { DashboardComponent } from './dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
    ],
  },
];
