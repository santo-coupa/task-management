import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { TaskResponse } from '../models/task-response.model';
import { UserTask } from '../models/task.model';
import { UserTaskStatus } from '../models/task-status.enum';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  private http = inject(HttpClient);

  private readonly API_URL = 'http://localhost:5017/tasks';

  getTasks(): Observable<UserTask[]> {

    return this.http.get<TaskResponse[]>(this.API_URL).pipe(
      map((tasks) =>
        tasks.map(task => ({
          id: task.id,
          title: task.name,
          status: task.status as UserTaskStatus,
          assignedToUserId: task.assigneeId ?? ''
        }))
      )
    );
  }
}