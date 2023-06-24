import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Login } from "../auth/models/login.model";
import { AuthService } from "../auth/services/auth.service";

@Component({
    selector:'app-login',
    templateUrl:'./login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent{

    constructor(
        private toastr : ToastrService,
        private authService :AuthService,
        private router :Router
    ){}
   
    login(loginForm: any) {
        const loginData: Login = loginForm.value;
        //after user is logged in and tokens are saved we do redirection
        //subscribe se izvrsava ako je sve proslo uspjesno

        //ovaj niz u subscribe nam omogucava da nakacimo
        //path varijable npr users/44 bi bilo ['users',44]
        this.authService.authenticate(loginData)
          .subscribe(data => {
            this.router.navigate(['home']);
            this.toastr.success('Successfully logged in!');
          }, error => {
            console.log('Error occurred.Error data: ', error);
          });
    }
}