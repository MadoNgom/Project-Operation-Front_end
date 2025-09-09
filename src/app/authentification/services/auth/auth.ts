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
        console.log({ response });
        // set user info in local storage
        if (response.data && response.data.token) {
          const token = response.data.token;
          // set token in local storage
          localStorage.setItem('auth_token', token);
          // this.jwtService.token = jwtDecode(token);
          this.read(`utilisateurs/me`).subscribe((userResponse: any) => {
            if (userResponse?.success) {
              localStorage.setItem(
                'user_info',
                JSON.stringify(userResponse?.data)
              );
              // Rediriger vers le dashboard après connexion réussie
              this.router.navigateByUrl('/dashboard');
            } else {
              throw new Error(
                "Échec de l'authentification: user info manquant"
              );
            }
          });
        } else {
          console.error('Token non trouvé dans la réponse:', response);
          throw new Error("Échec de l'authentification: token manquant");
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
  logout(): void {
    localStorage.clear();
    this.router.navigateByUrl('/');
  }
  // get user profile
  getUserProfile(): Observable<any> {
    return this.read(`account`).pipe(
      tap((response: any) => {
        localStorage.setItem('user_info', JSON.stringify(response));
      })
    );
  }

  getUserProfileV2(): Observable<any> {
    return this.read(`utilisateurs/me`).pipe(
      tap((response: any) => {
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
}
