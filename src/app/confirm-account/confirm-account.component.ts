import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Code } from '../auth/models/confirm.model';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.css']
})
export class ConfirmAccountComponent implements OnInit {

  sentMail :string="";

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private route : ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.sentMail=params['mail'];
    });
  }

  confirm(confirmForm: any) {
    const confirmData: Code = confirmForm.value;
    confirmData.mail = this.sentMail;
    this.authService.confirm(confirmData.mail, confirmData.code)
      .subscribe(data => {
        this.router.navigate(['home']);
        this.toastr.success("Account activated");
      }, error => {
        this.toastr.error("Account not found ");
      });
  }
}