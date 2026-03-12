import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile.model';
import { UpdateProfileRequest } from '../models/update-profile-request.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private API = 'http://localhost:5017/profile';

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(this.API);
  }

  updateProfile(request: UpdateProfileRequest): Observable<Profile> {
    return this.http.patch<Profile>(this.API, request);
  }

  updatePassword(request: any) {
    return this.http.patch('/profile/password', request);
  }
}
