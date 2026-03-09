import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';

import { SystemUser } from '../models/system-user.model';
import { CreateUserRequest } from '../models/create-user-request.model';
import { UpdateUserRequest } from '../models/update-user-request.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5017/users';

  private usersSubject = new BehaviorSubject<SystemUser[]>([]);
  readonly users$ = this.usersSubject.asObservable();

  loadUsers() {
    return this.http.get<SystemUser[]>(this.API_URL).pipe(
      tap(users => this.usersSubject.next(users))
    );
  }

  createUser(request: CreateUserRequest) {
    return this.http.post<SystemUser>(this.API_URL, request).pipe(
      map(created => {
        this.usersSubject.next([...this.usersSubject.value, created]);
        return created;
      })
    );
  }

  updateUser(id: string, request: UpdateUserRequest) {
    return this.http.patch<SystemUser>(`${this.API_URL}/${id}`, request).pipe(
      map(updated => {
        const updatedList = this.usersSubject.value.map( u =>
          u.id === id ? updated : u
        );
        this.usersSubject.next(updatedList);
        return updated;
      }),
    );
  }

  deleteUser(id: string){
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      map(() => {
        const filtered = this.usersSubject.value.filter(u => u.id !== id);
        this.usersSubject.next(filtered);
      })
    );
  }
}
