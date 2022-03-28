import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserLogin } from '../models/auth';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const user = localStorage.getItem('user');
    const storedUser: UserLogin = JSON.parse(user as string);
    
    if (!storedUser || !storedUser.token) {
      this.router.navigate(['/login'], {
        queryParams: {
          redirectTo: state.url,
        },
      });
    }
    return !!storedUser;
  }

}
