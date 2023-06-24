import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({providedIn:'root'})
export class isAuthenticated implements CanActivate{

    //sa ovim gardom smo rekli mozes pristupiti komponenti samo ako si logovan
    
    constructor(private authService :AuthService){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.authService.isAuthenticated.getValue();
    }
}