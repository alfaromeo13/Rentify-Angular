import { Component } from '@angular/core';
import { ResetConfirm } from '../auth/models/reset-confirm.model';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-reset-password-next',
  templateUrl: './reset-password-next.component.html',
  styleUrls: ['./reset-password-next.component.css']
})
export class ResetPasswordNextComponent {

  constructor(
    private authService: AuthService) { }

  resetPassword(resetForm: any): void {
    const resetData: ResetConfirm = resetForm.value;
    this.authService.confirmResetPassword(localStorage.getItem('email') + "", resetData.code, resetData.password);
  }
}