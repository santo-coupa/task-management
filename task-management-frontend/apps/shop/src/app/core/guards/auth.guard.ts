// import { Injectable } from '@angular/core';
// import { CanActivate, Router, UrlTree } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// @Injectable({ providedIn: 'root' })
// export class AuthGuard implements CanActivate {

//   constructor(
//     private auth: AuthService,
//     private router: Router
//   ) {}

//   /**
//    * Called every time user tries to access a guarded route
//    */
//   canActivate(): boolean | UrlTree {

//     // If user is logged in → allow navigation
//     if (this.auth.isAuthenticated()) {
//       return true;
//     }

//     // If not logged in → redirect to /auth
//     return this.router.createUrlTree(['/auth']);
//   }
// }
