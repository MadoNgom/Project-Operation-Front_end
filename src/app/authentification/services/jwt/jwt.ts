import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class Jwt {
  // Set token
  set token(id_token: string) {
    localStorage.setItem('auth_token', id_token);
  }
  // Get token
  get getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
  // Check if the token is valid
  isTokenValid(): boolean {
    const token = this.getToken;
    if (!token) {
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp > currentTime;
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  }
}
