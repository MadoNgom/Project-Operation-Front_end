import { Injectable, inject } from '@angular/core';
import { Auth } from '../auth/auth';
import { map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Role {
  private auth = inject(Auth);

  isAdmin() {
    return this.checkRole('ADMIN');
  }

  isUser() {
    return this.checkRole('USER');
  }

  checkRole(role: string) {
    return this.auth.getUserProfileV2().pipe(
      map(
        (currentUser: any) =>
          (currentUser.data?.role as string[] | undefined)?.includes(role) ??
          false
      ),
      catchError(() => of(false))
    );
  }
}
