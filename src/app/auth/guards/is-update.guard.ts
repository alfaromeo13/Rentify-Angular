import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: 'root' })
export class IsUpdateable implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const storedData = localStorage.getItem('selectedApartmentIdForUpdate');
        if (storedData)
            return true;
        else {
            this.router.navigate(['/home']);
            return false;
        }
    }
}

