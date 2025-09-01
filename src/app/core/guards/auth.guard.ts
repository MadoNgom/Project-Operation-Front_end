import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../authentification/services/auth/auth';

export const authGuard = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    router.navigateByUrl('/dashboard');
    return false;
  }

  return true;
};
