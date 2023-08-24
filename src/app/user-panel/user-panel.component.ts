import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApartmentService } from '../apartment/apartment.service';
import { AuthService } from '../auth/services/auth.service';
import { Chart } from 'chart.js/auto';
import { UserPanelService } from './user-panel.service';
import Swal from 'sweetalert2';
import { RentalService } from '../services/rental.service';
import { NotificationService } from '../services/notification.service';
import { NotificationDTO } from '../models/notification.model';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements OnInit {

  constructor(
    private router: Router,
    private rentalService: RentalService,
    public authService: AuthService,
    public notificationService: NotificationService,
    private userPanelService: UserPanelService,
    public apartmentService: ApartmentService) { }

  getReports() {
    this.notificationService.getNotificationsForUser().subscribe(data => {
      this.notificationService.notifications = data;
    });
  }

  deleteReport(Report: NotificationDTO) {
    if (Report.id) {
      this.notificationService.deleteById(Report.id).subscribe(data => {
        console.log('report deleted');
        this.getReports();
      });
    }
  }

  ngOnInit(): void {
    this.getReports();
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    this.rentalService.getIncomes().subscribe(data => {
      const maxNumber = Math.max(...data); // Get the maximum number from the data
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May',
            'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [{
            label: 'Monthly income in €',
            data: data,
            backgroundColor: 'hsl(141, 53%, 53%)',
            borderColor: 'hsl(0, 0%, 21%)',
            borderWidth: 2,
          }]
        },
        options: {
          plugins: {
            legend: {
              labels: {
                color: 'hsl(0, 0%, 21%)',
                font: {
                  size: 18 // Set the legend font size
                }
              }
            }
          },
          scales: {
            y: {
              ticks: {
                color: 'hsl(0, 0%, 21%)',
                font: {
                  size: 16 // Set the y-axis ticks font size
                }
              }, grid: {
                color: 'rgba(255, 255, 255, 0.3)', // Set the y-axis grid color to white with opacity
              },
              max: maxNumber, // Set the maximum value for the y-axis ticks
              suggestedMax: maxNumber
            },
            x: {
              ticks: {
                color: 'hsl(0, 0%, 21%)', // Set the x-axis ticks text color to white
                font: {
                  size: 16 // Set the x-axis ticks font size
                }
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.3)', // Set the x-axis grid color to white with opacity
              }
            },
          }
        }
      });
    });
  }

  showBookingHistory() {
    this.router.navigate(['booking-history']);
  }

  showRentingHistory() {
    this.router.navigate(['visited']);
  }

  showMyProperties() {
    console.log('usao')
    this.router.navigate(['my-properties']);
  }

  deleteAccount() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Enter your account password:',
          input: 'password',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Submit',
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          showLoaderOnConfirm: true,
          preConfirm: (password) => {
            return this.userPanelService.deleteAccount(password).subscribe(
              response => {
                this.authService.logout();
                this.router.navigate(['login']);
                Swal.fire(
                  'Deleted!',
                  'Your account has been deleted.',
                  'success'
                );
              }, error => {
                Swal.fire({
                  title: 'Password incorrect!',
                  icon: 'error',
                  confirmButtonColor: '#3085d6',
                })
                Swal.showValidationMessage(
                  `Request failed: Wrong password entered`
                );
              }
            );
          },
          allowOutsideClick: () => !Swal.isLoading()
        });
      }
    });
  }
}