import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationDTO } from '../models/notification.model';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  animations: [
    trigger('modalTransition', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ReportComponent implements OnInit {

  reportForm: FormGroup;

  constructor(
    private toastr: ToastrService,
    public notificationservice: NotificationService
  ) { }

  ngOnInit(): void {
    this.reportForm = new FormGroup({
      description: new FormControl(null)
    });
  }

  cancel() {
    this.notificationservice.isActive = false;
  }

  send() {
    const notification: NotificationDTO = {
      message: this.reportForm.value.description,
      receiverUsername: "johndoe",
    };
    this.notificationservice.addNotification(notification).subscribe(data => {
      this.toastr.success('Your report has been sent successfully');
      this.cancel();
    }, error => {
      console.log(error);
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    this.notificationservice.isActive = false;
  }
}