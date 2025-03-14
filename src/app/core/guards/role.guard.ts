import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const roles = route.data['roles'] as string[];

    if (!roles || roles.length === 0) {
      return true;
    }

    if (this.authService.hasRole(roles)) {
      return true;
    }

    // User doesn't have required role, redirect to dashboard
    this.router.navigate(['/dashboard']);
    return false;
  }
}
