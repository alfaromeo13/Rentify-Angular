import { HttpErrorResponse } from "@angular/common/http";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { catchError } from "rxjs";
import { switchMap } from "rxjs";
import { throwError } from "rxjs";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    constructor(
        private router : Router,
        private toastr :ToastrService,
        private authService:AuthService)
    {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //mi ovdje mozemo samo presresti zahtjev,zato treba da sacekamo da dobijemo
        //odgovor na taj zahtjev a onda da hendlujemo gresku ako se desila uopste(gledamo http status)
        return next.handle(req)
        .pipe(
          catchError((errorResponse: HttpErrorResponse) => {
            if (errorResponse.status === 401) {
              if(localStorage.getItem('refresh-token') != null){
                return this.authService.refresh_token().pipe(
                  switchMap(() => {
                    // Retry the original request with the updated tokens
                    const newHeaders = req.headers
                      .set('Authorization', 'Bearer ' + localStorage.getItem('access-token'));
                    const newReq = req.clone({ headers: newHeaders });
                    return next.handle(newReq) as Observable<HttpEvent<any>>;
                  }));
              } else { //if we got 401 but there wasn't any token
                this.toastr.warning('Unauthorized request<br>Please log in again to continue');
                this.router.navigate(['login']);
              }
            }else if(errorResponse.status === 400){
              for (const error of errorResponse.error.errors)
                this.toastr.warning(error.defaultMessage);
            } return throwError(errorResponse);
          })
        );
    }
}