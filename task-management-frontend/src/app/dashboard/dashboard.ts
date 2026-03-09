import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardUiService, DashboardVm } from './dashboard-ui.service';
import { Observable } from 'rxjs';
import { TaskService } from '../core/services/task.service';
import { ChartModule } from 'primeng/chart';
import { UserTaskStatus } from '../core/models/task-status.enum';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit{

  private uiService = inject(DashboardUiService);
  private taskService = inject(TaskService);

  vm$: Observable<DashboardVm> = this.uiService.vm$;

  ngOnInit(){
    this.taskService.loadTasks();
  }

  getStatusLabel(status: UserTaskStatus): string {
    return UserTaskStatus[status];
  }
}