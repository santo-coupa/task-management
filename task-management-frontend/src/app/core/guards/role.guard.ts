import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.enum';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  const allowedRoles = route.data?.['roles'] as Role[] | undefined;

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  const hasAccess = allowedRoles.some((role) => auth.hasRole(role));

  if (hasAccess) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
