import { Component, OnInit } from '@angular/core';
import { ApartmentService } from '../apartment/apartment.service';
import { FilterService } from '../filter/filter.service';
import { ApartmentDTO } from '../models/apartment.model';
import { ApartmentSearch } from '../models/search.model';

@Component({
  selector: 'app-visited-places',
  templateUrl: './visited-places.component.html',
  styleUrls: ['./visited-places.component.css']
})
export class VisitedPlacesComponent implements OnInit {

  showEmpty: boolean = false;
  showLoader: boolean = false;
  PAGE_TOLERANCE: number = 3;

  constructor(
    public filterService: FilterService,
    public apartmentService: ApartmentService,
  ) { }

  ngOnInit(): void {
    if (this.apartmentService.apartmentList.length !== 0) {
      this.apartmentService.generateRooms();
    } else {
      this.showLoader = true;
      const storedData = localStorage.getItem('apartmentSearch');
      if (storedData) {
        const apartmentSearch: ApartmentSearch = JSON.parse(storedData);
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
      }
    }
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
}