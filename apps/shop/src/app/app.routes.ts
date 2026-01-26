import { Routes } from '@angular/router';
import { LayoutComponent } from '@layout';
import { DashboardComponent } from './dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
    ],
  },
];

// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';

// // Guards
// import { AuthGuard } from './guards/auth.guard';
// import { PublicGuard } from './guards/public.guard';

// /**
//  * Root application routes
//  */
// const routes: Routes = [

//   /**
//    * ROOT PATH
//    * -----------
//    * This is the entry point of the app: '/'
//    *
//    * - We do NOT render a component here
//    * - The AuthGuard decides where the user should go
//    *
//    * Authenticated   → dashboard
//    * Not authenticated → auth
//    */
//   {
//     path: '',
//     pathMatch: 'full',
//     canActivate: [AuthGuard],
//   },

//   /**
//    * DASHBOARD
//    * ----------
//    * Protected area of the application
//    *
//    * - Lazy loaded for performance
//    * - Accessible ONLY if user is authenticated
//    */
//   {
//     path: 'dashboard',
//     loadChildren: () =>
//       import('./dashboard/dashboard.module').then(m => m.DashboardModule),
//     canActivate: [AuthGuard],
//   },

//   /**
//    * AUTH
//    * ----
//    * Public pages (login / register / forgot password)
//    *
//    * - If user is already authenticated,
//    *   PublicGuard redirects them to dashboard
//    * - Prevents logged-in users from seeing login page
//    */
//   {
//     path: 'auth',
//     loadChildren: () =>
//       import('./auth/auth.module').then(m => m.AuthModule),
//     canActivate: [PublicGuard],
//   },

//   /**
//    * WILDCARD
//    * --------
//    * Matches any unknown route
//    * Redirects back to root,
//    * where AuthGuard decides the correct destination
//    */
//   {
//     path: '**',
//     redirectTo: '',
//   },
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
// })
// export class AppRoutingModule {}
