import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: 'root' })
export class IsAdminPropertyGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authService.username === 'johndoe') {
            const storedData = localStorage.getItem('selectedType');
            if (storedData) return true;
            else {
                this.router.navigate(['/admin']);
                return false;
            };
        }
        this.router.navigate(['/home']);
        return false;
    }
}