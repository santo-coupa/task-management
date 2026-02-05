import { inject } from "@angular/core";
import {
  CanActivateFn,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { AuthService } from "../core";
import { Role } from "../core";

export const roleGuard : CanActivateFn = (
  route : ActivatedRouteSnapshot,
) : boolean | UrlTree => {
  
  const auth = inject(AuthService);
  const router = inject(Router);

  if(!auth.isAuthenticated()){
    return router.createUrlTree(['/auth/login']);
  }

  const allowedRoles = route.data['roles'] as Role[];

  if(!allowedRoles || allowedRoles.length === 0){
    return true;
  }

  const hasAccess = allowedRoles.some(role =>
    auth.hasRole(role)
  );

  if(hasAccess){
    return true;
  }

  return router.createUrlTree(['/dashboard']);
}