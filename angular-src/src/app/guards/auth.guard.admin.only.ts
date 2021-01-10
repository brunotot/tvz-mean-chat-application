import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthenticationAdminOnlyGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
            if (this.authService.isAuthenticated()) {
                if (this.authService.getUser().role == 'ADMIN') {
                    return true;
                }
            }
            this.router.navigate(['/login']);
            return false;
    }

}