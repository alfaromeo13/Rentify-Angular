import { OnDestroy, OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Observable, switchMap } from "rxjs";
import { ApartmentService } from "../apartment/apartment.service";
import { ApartmentDTO } from "../models/apartment.model";
import { ApartmentSearch } from "../models/search.model";
import { AdminPropertiesService } from "./admin-properties.service";

@Component({
  selector: 'app-admin-properties',
  templateUrl: './admin-properties.component.html',
  styleUrls: ['./admin-properties.component.css']
})
export class AdminPropertiesComponent implements OnInit, OnDestroy {

  show: boolean = false;
  enteredUsername: string = '';
  pageNumber: number = 0;
  userSearchForm: FormGroup;
  apartments: ApartmentDTO[] = [];
  isButtonDisabled: boolean = false;

  constructor(
    private apartmentService: ApartmentService,
    public propertiesService: AdminPropertiesService
  ) { }

  ngOnDestroy(): void {
    this.apartmentService.apartmentList = [];
  }

  ngOnInit(): void {
    this.getAll().subscribe(data => {
      this.apartments = data;
      this.apartmentService.apartmentList = data;
    });

    this.initializeForm();
    this.userSearchForm.get('searchTerm')?.valueChanges
      .pipe(
        switchMap(value => {
          if (value.length == 0)
            return this.getAll();
          return this.getByUsername(value);
        })
      ).subscribe(data => {
        this.pageNumber = 0;
        this.show = this.enteredUsername.length > 0;
        this.apartments = data;
        this.apartmentService.apartmentList = data;
        if (data.length < 25) this.isButtonDisabled = true;
      });
  }

  private initializeForm(): void {
    this.userSearchForm = new FormGroup({
      searchTerm: new FormControl(null)
    });
  }

  getByUsername(username: string): Observable<ApartmentDTO[]> {
    const types: string[] = [this.propertiesService.selectedType];
    this.enteredUsername = username;
    const apartmentSearch: ApartmentSearch = {
      type: types,
      isActive: false,
      username: username,
    };
    return this.propertiesService.findProperties(apartmentSearch);
  }

  getAll(): Observable<ApartmentDTO[]> {
    this.enteredUsername = '';
    const types: string[] = [this.propertiesService.selectedType];
    const apartmentSearch: ApartmentSearch = {
      type: types,
      isActive: false,
    };
    return this.propertiesService.findProperties(apartmentSearch);
  }

  previewProperty(id: number) {
    this.apartmentService.setSelected(id);
  }

  deleteApartment(apartment: ApartmentDTO): void {
    this.propertiesService.deleteById(apartment.id).subscribe(data => {
      apartment.isActive = false;
    }, error => {
      console.log('Error occured.', error)
    });
  }

  activateApartment(apartment: ApartmentDTO): void {
    this.propertiesService.activateById(apartment.id).subscribe(data => {
      apartment.isActive = true;
    }, error => {
      console.log('Error occured.', error)
    });
  }

  loadMore() {
    this.pageNumber++;
    this.getByUsername(this.enteredUsername).subscribe(data => {
      if (data.length < 25) this.isButtonDisabled = true;
      this.apartments = this.apartments.concat(data);
      this.apartmentService.apartmentList = this.apartmentService.apartmentList.concat(data);
    });
  }
}