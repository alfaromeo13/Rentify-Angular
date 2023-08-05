import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdminPropertiesService } from '../admin-properties/admin-properties.service';
import { ApartmentService } from '../apartment/apartment.service';
import { ApartmentDTO } from '../models/apartment.model';
import { NotificationDTO } from '../models/notification.model';
import { ApartmentSearch } from '../models/search.model';
import { NotificationService } from '../services/notification.service';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  apartments: number;
  condos: number;
  houses: number;
  studios: number;
  users: number;

  constructor(
    private toastr: ToastrService,
    public apartmentService: ApartmentService,
    public adminService: AdminService,
    public notificationService: NotificationService,
    private adminPropertyService: AdminPropertiesService,
    private propertiesService: AdminPropertiesService
  ) { }

  ngOnInit(): void {
    this.adminService.getNumbers().subscribe(data => {
      this.houses = data.houses;
      this.apartments = data.apartments;
      this.condos = data.condos;
      this.studios = data.studios;
    });

    this.adminService.getNumberOfUsers().subscribe(data => {
      this.users = data;
    });

    this.getNotApproved();
    this.getReports();
  }

  getNotApproved() {
    const apartmentSearch: ApartmentSearch = {
      isApproved: false,
    };
    this.propertiesService.findProperties(apartmentSearch).subscribe(data => {
      this.adminService.apartmentList = data;
    });
  }

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

  previewProperty(id: number) {
    this.apartmentService.selectedApartmentId = id;
    localStorage.setItem('selectedApartmentId', id + "");
  }

  accept(apartment: ApartmentDTO) {
    this.adminService.approveApartmentById(apartment.id).subscribe(data => {
      this.getNotApproved();
    }, error => {
      console.log(error);
    });
    this.toastr.info(apartment.propertyType.name + ' approved');
    switch (apartment.propertyType.name) {
      case 'Apartment':
        this.apartments++;
        break;
      case 'Condo':
        this.condos++;
        break;
      case 'House':
        this.houses++;
        break;
      case 'Studio':
        this.studios++;
        break;
      default:
        console.log('Invalid property type');
        break;
    }
  }

  decline(apartment: ApartmentDTO) {
    this.adminService.removeApartment(apartment.id).subscribe(data => {
      this.getNotApproved();
    }, error => {
      console.log(error);
    });
    this.toastr.info(apartment.propertyType.name + ' declined');
  }

  setSelected(type: string) {
    localStorage.setItem('selectedType', type);
    this.adminPropertyService.selectedType = type;
  }
}