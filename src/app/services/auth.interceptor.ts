import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { UserLogin } from '../models/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const savedUser = localStorage.getItem('user');
    const exception =
      request.url.endsWith('api/register') ||
      request.url.includes(`${environment.baseUrl}api/login`) ||
      request.url.includes(`http://api.geonames.org/`);
    if (!savedUser || exception) {
      return next.handle(request);
    } else {
      const authToken = JSON.parse(localStorage.getItem('user')) as UserLogin;
      const token = authToken.token;
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });
      return next.handle(authRequest);
    }
  }
}
