import { Routes } from '@angular/router'
import { ProfileComponent } from './profile'
import { ChangePasswordComponent } from './change-password/change-password'

export const profileRoutes: Routes = [
  {
    path: '',
    component: ProfileComponent
  },
  {
    path: 'password',
    component: ChangePasswordComponent
  }
]