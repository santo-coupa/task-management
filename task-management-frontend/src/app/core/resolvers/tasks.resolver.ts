import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TaskService } from '../services/task.service';
import { map } from 'rxjs';

export const tasksResolver: ResolveFn<boolean> = () => {

  const taskService = inject(TaskService);

  return taskService.loadTasks().pipe(
    map(() => true)
  );
};