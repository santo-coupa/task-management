import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  stats = [
    {
      title: 'Total Tasks',
      value: 42,
      icon: 'pi pi-list',
    },
    {
      title: 'Completed Tasks',
      value: 28,
      icon: 'pi pi-check-circle',
    },
    {
      title: 'Pending Tasks',
      value: 14,
      icon: 'pi pi-clock',
    },
    {
      title: 'Users',
      value: 5,
      icon: 'pi pi-users',
    },
  ];
}
