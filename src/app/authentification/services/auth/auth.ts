import { inject, Injectable } from '@angular/core';
import { Abstract } from '../../../core/services/abstract/abstract';
import { Jwt } from '../jwt/jwt';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class Auth extends Abstract<any> {
  private router = inject(Router);
  private jwtService = inject(Jwt);
  // login method
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.create(`auth/login`, credentials).pipe(
      tap((response: any) => {
        if (response.data && response.data.token) {
          const token = response.data.token;
          localStorage.setItem('auth_token', token);

          // Récupérer les infos utilisateur
          this.read(`utilisateurs/me`).subscribe({
            next: (userResponse: any) => {
              if (userResponse?.success) {
                const userInfo = userResponse.data;
                localStorage.setItem('user_info', JSON.stringify(userInfo));

                // Récupérer les transactions avec la fonction dédiée
              } else {
                throw new Error(
                  "Échec de l'authentification: user info manquant"
                );
              }
            },
            error: (err) =>
              console.error('Erreur récupération user info:', err),
          });
        }
      })
    );
  }

  register(credentials: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    password: string;
  }): Observable<any> {
    return this.create(`/auth/register`, credentials);
  }

  // check if user is authenticated
  isAuthenticated(): boolean {
    return this.jwtService.isTokenValid();
  }
  // get user info
  getUserInfo(): any {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  checkUserRole(role: string): boolean {
    const userInfo = this.getUserInfo();
    console.log({ userRole: userInfo?.data?.role });
    return userInfo?.data?.role === role;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigateByUrl('/');
  }
  // get user profile

  getUserProfileV2(): Observable<any> {
    return this.read(`utilisateurs/me`).pipe(
      tap((response: any) => {
        console.log('response', response);

        localStorage.setItem('user_info', JSON.stringify(response));
      })
    );
  }

  // update user profile
  updateUserProfile(data: any): Observable<any> {
    return this.update(`account`, data).pipe(
      tap((response: any) => {
        localStorage.setItem('user_info', JSON.stringify(response));
      })
    );
  }
  // change password
  changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Observable<any> {
    return this.update(`account/change-password`, data).pipe(
      tap(() => {
        this.router.navigateByUrl('/login');
      })
    );
  }
  // forget password
  forgetPassword(email: string): Observable<any> {
    return this.create(`account/forgot-password`, { email }).pipe(
      tap(() => {
        this.router.navigateByUrl('/login');
      })
    );
  }

  // get all users
  getUsers(): Observable<any> {
    return this.read(`utilisateurs`);
  }
}
