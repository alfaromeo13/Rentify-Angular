import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApartmentService } from '../apartment/apartment.service';
import { AuthService } from '../auth/services/auth.service';
import { FilterService } from '../filter/filter.service';
import { ApartmentDTO } from '../models/apartment.model';
import { RoomShowcaseModel } from '../models/roomshowcase';
import { ApartmentSearch } from '../models/search.model';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-my-properties',
  templateUrl: './my-properties.component.html',
  styleUrls: ['./my-properties.component.css']
})
export class MyPropertiesComponent implements OnInit, OnDestroy {
  showEmpty: boolean = false;
  showLoader: boolean = false;
  PAGE_TOLERANCE: number = 3;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    public authService: AuthService,
    public apartmentService: ApartmentService,
    public notificationService: NotificationService,
    public filterService: FilterService) { }

  ngOnInit(): void {
    this.showLoader = true;
    this.apartmentService.apartmani = [];
    this.apartmentService.apartmentList = [];
    const apartmentSearch: ApartmentSearch = {
      username: this.authService.username,
    };

    this.filterService.filter(apartmentSearch, 0).subscribe(
      (apartmentDTOs: ApartmentDTO[]) => {
        this.showLoader = false;
        this.apartmentService.apartmentList = apartmentDTOs;
        this.apartmentService.generateRooms();
        if (apartmentDTOs.length == 0)
          this.showEmpty = true;
      }, (error) => {
        this.showLoader = false;
        console.error(error);
      });
  }

  set_page_no(newPageNo: number): void {
    if (newPageNo > 0) {
      this.showEmpty = false;
      this.apartmentService.apartmani = [];
      this.showLoader = true;
      this.filterService.pageNo = newPageNo;
      this.filterService.filter(this.filterService.apartmentSearch, this.filterService.pageNo - 1).subscribe(
        (apartmentDTOs: ApartmentDTO[]) => {
          this.apartmentService.apartmentList = apartmentDTOs;
          this.apartmentService.generateRooms();
          this.showLoader = false;
          if (apartmentDTOs.length == 0)
            this.showEmpty = true;
        }, (error) => {
          this.showLoader = false;
          console.error(error);
        }
      );
    }
  }

  removeFavorite(id: number): void {
    this.apartmentService.deleteFavorite(id);
  }

  addFavorite(id: number): void {
    this.apartmentService.addFavorite(id);
  }

  hideApartment(soba: RoomShowcaseModel) {
    soba.isActive = false;
    this.toastr.info("Property hidden successfully and won't be visible to others");
    this.apartmentService.enableOrDisable(soba.pid).subscribe();
  }

  showApartment(soba: RoomShowcaseModel) {
    soba.isActive = true;
    this.toastr.success("Property is now visible to others")
    this.apartmentService.enableOrDisable(soba.pid).subscribe();
  }

  editApartment(id: number) {
    localStorage.setItem('selectedApartmentIdForUpdate', id + "");
    this.router.navigate(['update-property']);
  }

  ngOnDestroy(): void {
    this.filterService.pageNo = 1;
    this.filterService.isActive = false;
    this.apartmentService.apartmentList = [];
    this.apartmentService.apartmani = [];
  }
}