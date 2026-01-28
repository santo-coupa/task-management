// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { DashboardLayoutComponent } from './layout/dashboard-layout.component';
// import { LandingComponent } from './pages/landing/landing.component';
// import { StatsComponent } from './pages/stats/stats.component';

// /**
//  * Dashboard routes
//  *
//  * /dashboard
//  * /dashboard/stats
//  */
// const routes: Routes = [
//   {
//     path: '',
//     component: DashboardLayoutComponent,
//     children: [

//       /**
//        * Landing page
//        * Shown when user opens /dashboard
//        */
//       {
//         path: '',
//         component: LandingComponent,
//       },

//       /**
//        * Example feature page
//        */
//       {
//         path: 'stats',
//         component: StatsComponent,
//       },
//     ],
//   },
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule],
// })
// export class DashboardRoutingModule {}
