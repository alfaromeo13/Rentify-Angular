import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApartmentService } from '../apartment/apartment.service';
import { FilterService } from '../filter/filter.service';
import { ApartmentDTO } from '../models/apartment.model';
import { RentalApartmentDTO } from '../models/rental-apartment.model';
import { ApartmentSearch } from '../models/search.model';
import { NotificationService } from '../services/notification.service';
import { RentalService } from '../services/rental.service';

@Component({
  selector: 'app-visited-places',
  templateUrl: './visited-places.component.html',
  styleUrls: ['./visited-places.component.css']
})
export class VisitedPlacesComponent implements OnInit, OnDestroy {
  showEmpty: boolean = false;
  showLoader: boolean = false;
  PAGE_TOLERANCE: number = 3;
  visitedPlaces: RentalApartmentDTO[] = [];

  constructor(
    public filterService: FilterService,
    public rentalService: RentalService,
    public apartmentService: ApartmentService,
    public notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.apartmentService.apartmani = [];
    this.apartmentService.apartmentList = [];
    this.find(0);
  }

  find(pageNumber: number) {
    this.rentalService.getVisited(pageNumber).subscribe(data => {
      this.showLoader = true;
      this.visitedPlaces = data;

      for (const dateTime of this.visitedPlaces) {
        const newStart = moment(dateTime.startDate, 'DD/MM/YYYY').add(1, 'days').toDate();
        const newEnd = moment(dateTime.endDate, 'DD/MM/YYYY').add(1, 'days').toDate();
        dateTime.startDate = moment(newStart).format('DD/MM/YYYY');;
        dateTime.endDate = moment(newEnd).format('DD/MM/YYYY');
      }

      console.log('dobili smo id-eve ::', data);
      const apartmentSearch: ApartmentSearch = { id: [] };

      for (const place of this.visitedPlaces)
        apartmentSearch.id?.push(place.apartmentId);

      if (this.visitedPlaces.length == 0)
        apartmentSearch.id?.push(-1);

      this.filterService.filter(apartmentSearch, 0).subscribe(
        (apartmentDTOs: ApartmentDTO[]) => {
          console.log(apartmentDTOs);
          this.apartmentService.apartmentList = apartmentDTOs;
          this.showLoader = false;
          this.apartmentService.generateRooms();
          if (apartmentDTOs.length == 0)
            this.showEmpty = true;
        }, (error) => {
          console.error(error);
        }
      );
    });
  }

  set_page_no(newPageNo: number): void {
    if (newPageNo > 0) {
      this.showEmpty = false;
      this.apartmentService.apartmani = [];
      this.showLoader = true;
      this.filterService.pageNo = newPageNo;
      this.find(newPageNo - 1);
    }
  }

  removeFavorite(id: number): void {
    this.apartmentService.deleteFavorite(id);
  }

  addFavorite(id: number): void {
    this.apartmentService.addFavorite(id);
  }

  ngOnDestroy(): void {
    this.filterService.pageNo = 1;
    this.filterService.isActive = false;
    this.apartmentService.apartmentList = [];
    this.apartmentService.apartmani = [];
  }
}