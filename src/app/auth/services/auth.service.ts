import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Login } from "../models/login.model";
import { JwtToken } from "../models/jwt.model";
import { BehaviorSubject } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import { Register } from "../models/register.model";
import { ToastrService } from "ngx-toastr";

@Injectable({providedIn:'root'})
export class AuthService{

    isAuthenticated = new BehaviorSubject<boolean>(false);
    
    constructor(
        private toastr: ToastrService,
        private httpClient: HttpClient
    ){}

    //this is our login
    authenticate(loginData: Login): Observable<any> {
        const url = `${environment.apiUrl}authenticate/login`;
        //JwtToken is what we expect in response
        return this.httpClient.post<JwtToken>(url, loginData)
          .pipe(tap(responseData => {
            const access = responseData.token;
            const refresh= responseData["refresh-token"];
            localStorage.setItem('access-token', access);
            localStorage.setItem('refresh-token', refresh);
            this.isAuthenticated.next(true);//user is logged in
        }));
    }

    register(registerData: Register){
        const url = `${environment.apiUrl}authenticate/register`;
        return this.httpClient.post<JwtToken>(url, registerData)
    }

    resetPassword(mail: string): void {
        const url = `${environment.apiUrl}authenticate/request-reset-password`;
        const params = { mail: mail };
        this.httpClient.post(url, null, { params , responseType: 'text' })
        .subscribe(response => {
            this.toastr.success("Mail sent successfully");
        },error => {// Handle any errors here
            this.toastr.error("Mail not found");
      });
    }

    signup(data: Register): Observable<any> {
        const url = `${environment.apiUrl}authenticate/register`;
        return this.httpClient.post(url, data);
    }

    logout(): void { //we remove tokens
        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
        this.isAuthenticated.next(false);
    }

    confirm(mail :string,code :string){
        const url = `${environment.apiUrl}authenticate/verify?${mail}&${code}`;
        const params = { mail: mail , code: code};
        return this.httpClient.post(url, null, { params , responseType: 'text' });
    }
    
    refresh_token(): Observable<any> {
        const url = `${environment.apiUrl}authenticate/refresh-token`;
        const currentHeaders = new HttpHeaders();
        const headers = currentHeaders.append
        ('refresh-token', localStorage.getItem('refresh-token') || '');
        this.logout();
       // Make the HTTP POST request with the headers
        return this.httpClient.post<JwtToken>(url, null, { headers })
          .pipe( //if our refresh token has expired we have to login again
              tap(responseData => { //otherwise we extended our tokens
              const access = responseData.token;
              const refresh = responseData['refresh-token'];
              localStorage.setItem('access-token', access);
              localStorage.setItem('refresh-token', refresh);
              this.isAuthenticated.next(true);
            })
        );
    }
}