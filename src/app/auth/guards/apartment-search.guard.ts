import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { ApartmentService } from "src/app/apartment/apartment.service";

@Injectable({ providedIn: 'root' })
export class ApartmentSearchGuard implements CanActivate {

    constructor(
        private apartmentService: ApartmentService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const isLiked = localStorage.getItem('liked');
        const isSeachedFor = localStorage.getItem('apartmentSearch');
        //liked se brise iz local storagea na ngOnDestroy 'apartments' komponente
        if (isLiked || isSeachedFor) return true;
        else {
            this.router.navigate(['/home']);
            return false;
        }
    }
}