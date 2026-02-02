import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // If authenticated user, allow 
  if (auth.isLoggedIn()) {
    return true;
  }

  // If not authenticated user redirect to login page
  return router.createUrlTree(['/auth/login']);
};
