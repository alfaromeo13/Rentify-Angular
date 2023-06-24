import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "../services/auth.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor{

    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //ovo nam govori je li korisnik prijavljen ili ne
        const isAuthenticated = this.authService.isAuthenticated.getValue();
        const isApiUrl = req.url.startsWith(environment.apiUrl);
        const token=localStorage.getItem('access-token');
        if(isAuthenticated && isApiUrl){
            req=req.clone({
                setHeaders:{
                    'Authorization' : `Bearer ${token}`
                }
            });
        }
        return next.handle(req);
    }
}