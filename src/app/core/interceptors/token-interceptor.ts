import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Jwt } from '../../authentification/services/jwt/jwt';
import { Observable } from 'rxjs';

export class TokenInterceptor implements HttpInterceptor {
  private jwtService = inject(Jwt);
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.jwtService.token;
    // Check if the token exists
    req = req.clone({
      setHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    return next.handle(req);
  }
}
