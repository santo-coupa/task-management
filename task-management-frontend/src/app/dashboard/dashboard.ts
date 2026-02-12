import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardUiService } from './dashboard-ui.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  vm$;

  constructor(private uiService: DashboardUiService) {
    this.vm$ = this.uiService.vm$;
  }
}
