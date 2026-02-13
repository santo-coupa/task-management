import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardUiService, DashboardVm } from './dashboard-ui.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {

  private uiService = inject(DashboardUiService);

  vm$: Observable<DashboardVm> = this.uiService.vm$;
}