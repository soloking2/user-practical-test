import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Auth, UserLogin } from '../models/auth';

import {
  catchError,
  filter,
  finalize,
  map,
  switchMap,
  tap,
  timeout,
} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessagesService } from '../shared/messages.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environment.baseUrl;
  private user = 'user';
  private expiration = 'expiration';
  savedUser = localStorage.getItem(this.user);
  private userSubject = new BehaviorSubject<UserLogin>(
    this.savedUser ? JSON.parse(this.savedUser) : null
  );
  user$ = this.userSubject.asObservable();
  token: string;
  private authTimer: any;

  // TIME TO LOGOUT
  expirationInMinutes: number = 600;
  remainingTime: number = 0;

  // LOGIN OBSERVABLES
  private loginSub = new Subject<Auth>();
  loginAction = this.loginSub.asObservable();

  // REGISTER OBSERVABLE
  private registerSub = new Subject<Auth>();
  registerAction = this.registerSub.asObservable();

  // LOADING OBSERVABLE
  loading = new BehaviorSubject<boolean>(false);

  // LOGGING A USER IN
  login$ = this.loginAction.pipe(
    filter((data) => Boolean(data.email)),
    switchMap((data) =>
      this.http.post<UserLogin>(`${this.url}api/login`, data).pipe(
        tap((data) => this.setUser(data)),
        tap((data) => this.setExpirationTime()),
        tap((data) => {
          this.alert.setMessage({
            type: 'success',
            title: 'Login Successful',
            body: 'Please wait! You will be taking to the platform shortly. ',
          });
        }),
        tap((data) => {
          data.token
            ? setTimeout(() => this.router.navigate(['/users']), 500)
            : console.log('::LOGIN FAILED :::');
        }),
        catchError((err) => EMPTY),
        finalize(() => {
          this.loading.next(false);
        })
      )
    )
  );

  register$ = this.registerAction.pipe(
    filter((data) => Boolean(data.email) && Boolean(data.password)),
    switchMap((data) =>
      this.http.post<UserLogin>(`${this.url}api/register`, data).pipe(
        tap((data) => this.setUser(data)),
        tap((data) => this.setExpirationTime()),
        tap((res) => {
          this.alert.setMessage({
            type: 'success',
            title: 'Registration Successful',
            body: 'Please wait! You will be taking to the platform shortly. ',
          });
        }),
        tap((res) => {
          if (res.token) {
            setTimeout(() => {
              this.router.navigate(['/users']);
            }, 500);
          }
        }),
        catchError((err) => EMPTY),
        finalize(() => {
          this.loading.next(false);
        })
      )
    )
  );

  constructor(
    private http: HttpClient,
    private alert: MessagesService,
    private router: Router
  ) {}

  loginUser(data: Auth) {
    this.loginSub.next(data);
    this.loading.next(true);
  }

  registerUser(data: Auth) {
    this.registerSub.next(data);
    this.loading.next(true);
  }

  // refreshToken(token: string) {
  //   const data = {
  //     refresh: token,
  //   };
  //   return this.http
  //     .post(`${this.url}api/login/refresh-token`, data, {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json',
  //       }),
  //     })
  //     .pipe(
  //       tap((res: any) => {
  //         const user = this.getUser();
  //         const data = { ...user };
  //         data.token = res.access;
  //         this.setUser(data);
  //       }),
  //       map((res) => res)
  //     );
  // }

  getToken() {
    return this.token;
  }

  setUser(user: UserLogin) {
    localStorage.setItem('user', JSON.stringify(user));
    this.token = user.token;
    this.userSubject.next(user);
  }

  setExpirationTime() {
    this.setAuthTimer(this.expirationInMinutes);
    const now = new Date();
    const expirationDate = new Date(
      now.getTime() + this.expirationInMinutes * 1000
    );
    this.remainingTime = this.expirationInMinutes;
    localStorage.setItem(this.expiration, expirationDate.toISOString());
  }

  getUser(): UserLogin | null {
    const user: UserLogin = JSON.parse(localStorage.getItem(this.user));
    return user;
  }

  getRefreshToken(): string | null {
    const user = this.getUser();
    const accessToken = user.token;
    return accessToken;
  }

  autoAuthUser() {
    const userInfo = this.authUserInfo();
    if (!userInfo) {
      this.router.navigate(['/login']);
      return;
    } else {
      const now = new Date();
      const expireIn = userInfo.expirationDate.getTime() - now.getTime();
      this.remainingTime = expireIn / 1000;
      if (expireIn > 0) {
        const userDetails: UserLogin = JSON.parse(userInfo.user);
        this.token = userDetails.token;
        this.userSubject.next(userDetails);
        // this.router.navigate(['/users'])
        this.setAuthTimer(expireIn / 1000);
      }
    }
  }

  private setAuthTimer(duration: number) {
    this.authTimer = setTimeout(() => {
      this.clearUser();
      window.location.reload();
      this.router.navigate(['/login']);
    }, duration * 1000);
  }

  private authUserInfo() {
    const user = localStorage.getItem(this.user);
    const expirationDate = localStorage.getItem(this.expiration);

    if (!user || !expirationDate) {
      return;
    }
    return {
      user,
      expirationDate: new Date(expirationDate),
    };
  }

  // CLEAR USER DETAILS
  clearUser() {
    this.savedUser = null;
    this.token = null;
    localStorage.removeItem(this.user);
    localStorage.removeItem(this.expiration);
    this.userSubject.next(null);
    clearTimeout(this.authTimer);
    window.location.reload()
    this.userSubject.unsubscribe();
    this.router.navigate(['/login']);
  }
}
