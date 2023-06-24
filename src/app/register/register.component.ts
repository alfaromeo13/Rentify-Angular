import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Register } from "../auth/models/register.model";
import { AuthService } from "../auth/services/auth.service";

@Component({
    selector:'app-register',
    styleUrls:['register.component.css'],
    templateUrl:'./register.component.html'})
export class RegisterComponent{

  shouldLoad: boolean = false;

    constructor(
        private router : Router,
        private toastr: ToastrService,
        private authService :AuthService){}

        register(registerForm: any) {
          this.shouldLoad=true;
            const registerData: Register = registerForm.value;
            this.authService.register(registerData)
              .subscribe(data => {
                this.shouldLoad=false;
                this.router.navigate(['login']);
                this.toastr.warning('Activation link sent on your email');
              }, error => {
                this.shouldLoad=false;
                console.log('Error occurred.Error data: ', error);
              });
        }
}