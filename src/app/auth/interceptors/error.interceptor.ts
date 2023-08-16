import { HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, catchError, filter, take, tap } from "rxjs";
import { switchMap } from "rxjs";
import { throwError } from "rxjs";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  counter: number = 0;
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService) { }

  private addAuthorizationHeader(req: HttpRequest<any>): HttpRequest<any> {
    const accessToken = localStorage.getItem('access-token');
    if (accessToken) {
      // Set the 'Authorization' header with the access token
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
      });
      return req.clone({ headers });
    }
    return req;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addAuthorizationHeader(req)).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 401) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            return this.authService.refresh_token().pipe(
              switchMap((responseData: any) => {
                this.counter = 0;
                this.isRefreshing = false;
                this.refreshTokenSubject.next(responseData.token);
                // Retry the original request with the new token
                return next.handle(this.addAuthorizationHeader(req));
              })
            );
          } else {
            this.counter++;
            if (this.counter == 2) {
              this.counter = 0;
              this.isRefreshing = false;
              this.toastr.warning('Session timed out. Please log in again.');
              this.authService.logout();
              this.router.navigate(['login']);
            }
            // If the token is already being refreshed, wait for the new token
            return this.refreshTokenSubject.pipe(
              filter(token => token !== null),
              switchMap(() => next.handle(this.addAuthorizationHeader(req)))
            );
          }
        } else if (errorResponse.status === 400 || errorResponse.status === 413) {
          if (errorResponse.error && errorResponse.error.errors) {
            for (const error of errorResponse.error.errors)
              this.toastr.warning(error.defaultMessage);
          }
        }
        return throwError(errorResponse);
      })
    );
  }
}