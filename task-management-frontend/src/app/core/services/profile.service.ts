import { HttpClient } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { Profile } from "../models/profile.model"
import { UpdateProfileRequest } from "../models/update-profile-request.model"

@Injectable({ providedIn: 'root' })
export class ProfileService {

  private http = inject(HttpClient)

  private API = 'http://localhost:5017/profile'

  getProfile() {
    return this.http.get<Profile>(this.API)
  }

  updateProfile(request: UpdateProfileRequest) {
    return this.http.patch<Profile>(this.API, request)
  }
}