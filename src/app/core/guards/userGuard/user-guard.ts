import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { Role } from '../../../authentification/services/role/role';

export const userGuard: CanActivateFn = (route, state) => {
  const roleService = inject(Role);
  const router = inject(Router);
  return roleService.isUser().pipe(
    map((isUser) => {
      if (!isUser) {
        router.navigate(['/unauthorized']);
      }
      return isUser;
    })
  );
};
