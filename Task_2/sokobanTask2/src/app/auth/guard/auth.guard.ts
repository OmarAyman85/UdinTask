import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  CanLoad,
  Route,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; // adjust path as needed

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Guard to check if user is authenticated before activating route.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.isLoggedIn$.pipe(
      take(1), // take only the latest value and complete
      map((isLoggedIn) => {
        if (isLoggedIn) {
          return true;
        }
        // Redirect to login if not authenticated
        return this.router.createUrlTree(['/login']);
      })
    );
  }

  /**
   * Guard to prevent lazy-loaded modules from loading if not authenticated.
   */
  canLoad(route: Route): Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(
      take(1),
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
