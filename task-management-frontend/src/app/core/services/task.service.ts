import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';

import { TaskResponse } from '../models/task-response.model';
import { UserTask } from '../models/task.model';
import { UserTaskStatus } from '../models/task-status.enum';
import { CreateTaskRequest } from '../models/create-task-request.model';
import { UpdateTaskRequest } from '../models/update-task-request.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);

  private readonly API_URL = 'http://localhost:5017/tasks';

  private tasksSubject = new BehaviorSubject<UserTask[]>([]);
  readonly tasks$ = this.tasksSubject.asObservable();

  loadTasks(): void {
    this.http
      .get<TaskResponse[]>(this.API_URL)
      .pipe(map((tasks) => tasks.map((task) => this.mapTask(task))))
      .subscribe((tasks) => {
        this.tasksSubject.next(tasks);
      });
  }

  createTask(request: CreateTaskRequest) {
    return this.http.post<TaskResponse>(this.API_URL, request).pipe(
      map((response) => {
        const mapped = this.mapTask(response);

        this.tasksSubject.next([...this.tasksSubject.value, mapped]);

        return mapped;
      }),
    );
  }

  updateTask(id: string, request: UpdateTaskRequest) {
    return this.http.patch<TaskResponse>(`${this.API_URL}/${id}`, request).pipe(
      map((response) => {
        const mapped = this.mapTask(response);

        const updated = this.tasksSubject.value.map((task) => (task.id === id ? mapped : task));

        this.tasksSubject.next(updated);

        return mapped;
      }),
    );
  }

  deleteTask(id: string) {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      map(() => {
        const filtered = this.tasksSubject.value.filter((task) => task.id !== id);

        this.tasksSubject.next(filtered);
      }),
    );
  }

  private mapTask(task: TaskResponse): UserTask {
    return {
      id: task.id,
      title: task.name,
      status: task.status as UserTaskStatus,
      assignedToUserId: task.assigneeId ?? '',
    };
  }
}
