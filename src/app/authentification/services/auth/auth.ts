import { inject, Injectable } from '@angular/core';
import { Abstract } from '../../../core/services/abstract/abstract';
import { Jwt } from '../jwt/jwt';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth extends Abstract<any> {
  private router = inject(Router);
  private jwtService = inject(Jwt);
  // login method
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.create(`login`, credentials).pipe(
      tap((response: any) => {
        this.jwtService.token = response.id_token;
        this.read(`account`).subscribe((response: any) => {
          localStorage.setItem('user_info', JSON.stringify(response));
        });
      })
    );
  }
  // register method
  register(credentials: {
    username: string;
    password: string;
  }): Observable<any> {
    return this.create(`register`, credentials).pipe(
      tap((response: any) => {
        this.jwtService.token = response.id_token;
        this.read(`account`).subscribe((response: any) => {
          localStorage.setItem('user_info', JSON.stringify(response));
        });
      })
    );
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
