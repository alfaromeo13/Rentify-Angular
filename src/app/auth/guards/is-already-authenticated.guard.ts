import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({providedIn:'root'})
export class IsAlreadyAuthenticatedGuard implements CanActivate{

    constructor(private authService :AuthService){}

    //if user is already logged in he cannot log again!
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return localStorage.getItem('access-token') === undefined;
    }
}