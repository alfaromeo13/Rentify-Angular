import { Component, OnInit } from '@angular/core';
import { ApartmentService } from './apartment.service';
import { FilterService } from '../filter/filter.service';
import { ApartmentDTO } from '../models/apartment.model';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.css']
})
export class ApartmentComponent implements OnInit {

  PAGE_TOLERANCE: number = 3;

  constructor(
    public filterService: FilterService,
    public apartmentService: ApartmentService
  ) { }

  ngOnInit(): void {
    this.apartmentService.generateRooms();
  }

  set_page_no(newPageNo: number): void {
    if (newPageNo > 0) {
      this.filterService.pageNo = newPageNo;
      this.filterService.filter(this.filterService.apartmentSearch, this.filterService.pageNo - 1).subscribe(
        (apartmentDTOs: ApartmentDTO[]) => {
          this.apartmentService.apartmentList = apartmentDTOs;
          this.apartmentService.generateRooms();
        }, (error) => {
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

  click(): void {
    this.filterService.isActive = true;
  }
}