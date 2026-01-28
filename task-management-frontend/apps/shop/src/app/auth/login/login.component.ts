// import { Component } from '@angular/core';
// import { FormBuilder, Validators } from '@angular/forms';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
// })
// export class LoginComponent {

//   /**
//    * Simple login form
//    * (no real auth logic here — just structure)
//    */
//   form = this.fb.group({
//     email: ['', [Validators.required, Validators.email]],
//     password: ['', Validators.required],
//   });

//   constructor(
//     private fb: FormBuilder,
//     private router: Router
//   ) {}

//   /**
//    * Fake login handler
//    * In real app → call AuthService
//    */
//   login(): void {
//     if (this.form.invalid) {
//       return;
//     }

//     // Pretend login succeeded
//     this.router.navigate(['/dashboard']);
//   }
// }
