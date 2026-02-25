import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserTask } from '../models/task.model';
import { TaskResponse } from '../models/task-response.model';
import { CreateTaskRequest } from '../models/create-task-request.model';
import { UserTaskStatus } from '../models/task-status.enum';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  private http = inject(HttpClient);

  private readonly API_URL = 'http://localhost:5017/tasks';

  private tasksSubject = new BehaviorSubject<UserTask[]>([]);
  readonly tasks$ = this.tasksSubject.asObservable();

  loadTasks(): void {
    this.http.get<TaskResponse[]>(this.API_URL)
      .pipe(
        map(tasks =>
          tasks.map(task => ({
            id: task.id,
            title: task.name,
            status: task.status as UserTaskStatus,
            assignedToUserId: task.assigneeId ?? ''
          }))
        )
      )
      .subscribe(tasks => {
        this.tasksSubject.next(tasks);
      });
  }

  createTask(request: CreateTaskRequest) {
    return this.http.post<TaskResponse>(this.API_URL, request).pipe(
      map((createdTask) => {
        const mappedTask : UserTask = {
           id: createdTask.id,
           title: createdTask.name,
           status: createdTask.status as UserTaskStatus,
           assignedToUserId: createdTask.assigneeId ?? ''
        };

        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next([...currentTasks,mappedTask]);

        return mappedTask;
      })
    );
  }
}