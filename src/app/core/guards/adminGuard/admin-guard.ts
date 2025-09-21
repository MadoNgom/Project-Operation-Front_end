import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { Role } from '../../../authentification/services/role/role';

export const adminGuard: CanActivateFn = (route, state) => {
  const roleService = inject(Role);
  const router = inject(Router);
  return roleService.isAdmin().pipe(
    map((isAdmin) => {
      if (!isAdmin) {
        router.navigate(['/unauthorized']);
      }
      return isAdmin;
    })
  );
};
