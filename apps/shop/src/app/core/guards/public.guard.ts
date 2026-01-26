// import { Injectable } from '@angular/core';
// import { CanActivate, Router, UrlTree } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// @Injectable({ providedIn: 'root' })
// export class PublicGuard implements CanActivate {

//   constructor(
//     private auth: AuthService,
//     private router: Router
//   ) {}

//   /**
//    * Prevent authenticated users from accessing public pages
//    * like login or register
//    */
//   canActivate(): boolean | UrlTree {

//     // If user is already logged in,
//     // redirect them to dashboard
//     if (this.auth.isAuthenticated()) {
//       return this.router.createUrlTree(['/dashboard']);
//     }

//     // Otherwise, allow access to auth pages
//     return true;
//   }
// }
