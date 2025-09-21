// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { Auth } from '../../authentification/services/auth/auth';
// import { Role } from '../../authentification/services/role/role';

// export const authGuard: CanActivateFn = () => {
//   const roleService = inject(Role);
//   const auth = inject(Auth);
//   const router = inject(Router);

//   if (!auth.isAuthenticated()) {
//     router.navigateByUrl('/dashboard');
//     return false;
//   }

// };
// export const adminGuard: CanActivateFn = () => {
//   const roleService = inject(Role);
//   const router = inject(Router);

//   if (!roleService.isAdmin()) {
//     return roleRedirect(roleService, router); // Redirige et refuse l'accès
//   }

//   return roleService.isAdmin();
// };

// // function de redirection
// function roleRedirect(roleService: Role, router: Router): boolean {
//   if (roleService.isAdmin()) {
//     router.navigate(['/admin']);
//     return false;
//   }

//   if (roleService.isUser()) {
//     router.navigate(['dashboard']);
//     return false;
//   }

//   // Gestion des rôles non identifiés
//   router.navigate(['/not-found']);
//   return false;
// }
