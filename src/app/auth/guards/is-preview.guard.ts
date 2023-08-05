import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class IsPreviewGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const storedData = localStorage.getItem('selectedApartmentId');
        if (storedData)
            return true;
        else {
            this.router.navigate(['/home']);
            return false;
        }
    }
}