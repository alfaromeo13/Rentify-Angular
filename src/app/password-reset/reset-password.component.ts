import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Reset } from "../auth/models/reset.model";
import { AuthService } from "../auth/services/auth.service";

@Component({
    selector:'app-reset',
    templateUrl:'./reset-password.component.html',
    styleUrls: ['./reset-password.component.css']})
export class ResetPassword{

    constructor(
        private router : Router,
        private authService :AuthService){}

    resetPassword(resetForm: any) : void {
        const loginData: Reset = resetForm.value;
        this.authService.resetPassword(resetForm.value.email);
        this.router.navigate(['login']);
    }
}