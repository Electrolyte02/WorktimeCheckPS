import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private router:Router = inject(Router);

  canActivate(): boolean | Observable<boolean> {
    const isLoggedIn = !!localStorage.getItem('token'); // or use an AuthService

    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}