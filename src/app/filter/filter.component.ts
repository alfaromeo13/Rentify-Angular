import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FilterService } from './filter.service';
import { ApartmentSearch } from '../models/search.model';
import { Country } from '../models/country.model';
import { NeighborhoodDTO } from '../models/neighbourhood.model';
import { FormControl, FormGroup } from '@angular/forms';
import { CityService } from '../city/city.service';
import { CountryService } from '../services/country.service';
import { NeighbourhoodService } from '../services/neighbourhood.service';
import { debounceTime } from 'rxjs';
import { switchMap } from 'rxjs';
import { City } from '../models/city.model';
import { HostListener } from '@angular/core';
import { ApartmentDTO } from '../models/apartment.model';
import { ApartmentService } from '../apartment/apartment.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
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
export class FilterComponent implements OnInit {
  selectedType: string[] = [];
  selectedPeriod: string[] = [];
  selectedMinPrice: number;
  selectedMaxPrice: number;
  selectedMinNumOfBedrooms: number;
  selectedMaxNumOfBedrooms: number;
  selectedMinNumOfBathrooms: number;
  selectedMaxNumOfBathrooms: number;
  selectedMinSquareMeters: number;
  selectedMaxSquareMeters: number;
  selectedCountryName: string = '';
  selectedCountryCode: string = '';
  selectedCityName: string = '';
  selectedNeighborhoodName: string;
  selectedUsername: string;
  selectedAvailableFrom: Date;
  selectedAvailableTo: Date;
  isCondoClicked: boolean = false;
  isApartmentClicked: boolean = false;
  isHouseClicked: boolean = false;
  isStudioClicked: boolean = false;
  isParkingClicked: boolean = false;
  isPetsClicked: boolean = false;
  isAppliancesClicked: boolean = false;
  isBalconyClicked: boolean = false;
  isAirClicked: boolean = false;
  isFurnishedClicked: boolean = false;
  isWifiClicked: boolean = false;
  isElevatorClicked: boolean = false;
  isDayClicked: boolean = false;
  isMonthClicked: boolean = false;
  isCityInputDisabled: boolean = true;
  isDropdownActive: boolean = false;
  isNeighborhoodInputDisabled: boolean = true;

  countries: Country[] = [];
  cities: City[] = [];
  neighbourhoods: NeighborhoodDTO[] = [];

  countrySearchForm: FormGroup;
  citySearchForm: FormGroup;
  neighbourhoodSearchForm: FormGroup;

  constructor(
    private cityService: CityService,
    public filterService: FilterService,
    private countryService: CountryService,
    private apartmentService: ApartmentService,
    private neighbourhoodService: NeighbourhoodService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.countrySearchForm.get('searchTerm')?.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => {
          if (value != null)
            return this.countryService.searchByTerm(value);
          else return of([]);
        })
      ).subscribe(data => {
        this.countries = data;
      });

    this.citySearchForm.get('searchTerm')?.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => {
          if (this.selectedCountryName != null)
            return this.cityService.searchByCityAndCountry(value, this.selectedCountryName);
          else return of([]);
        })
      ).subscribe(data => {
        this.cities = data;
      });

    this.neighbourhoodSearchForm.get('searchTerm')?.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => {
          if (this.selectedCityName != null)
            return this.neighbourhoodService.searchByCityAndNeighborhoodName(value, this.selectedCityName);
          else return of([]);
        })
      ).subscribe(data => {
        this.neighbourhoods = data;
      });
  }

  private initializeForm(): void {
    this.countrySearchForm = new FormGroup({
      searchTerm: new FormControl(null)
    });

    this.citySearchForm = new FormGroup({
      searchTerm: new FormControl({ value: null, disabled: true })
    });

    this.neighbourhoodSearchForm = new FormGroup({
      searchTerm: new FormControl({ value: null, disabled: true })
    });
  }

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }

  selectValue(value: string) {
    this.filterService.sort = value;
    this.toggleDropdown();
  }

  enableCity() {
    if (this.selectedCountryName.length != 0)
      this.citySearchForm.enable();
    else {
      this.selectedCountryName = "";
      this.selectedCityName = "";
      this.selectedNeighborhoodName = "";
      this.citySearchForm.disable();
    }
  }

  enableNeighbourhood() {
    if (this.selectedCityName.length != 0)
      this.neighbourhoodSearchForm.enable();
    else {
      this.selectedCityName = "";
      this.selectedNeighborhoodName = "";
      this.neighbourhoodSearchForm.disable();
    }
  }

  cancel() {
    this.filterService.isActive = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    this.filterService.isActive = false;
  }

  onCondoClick() {
    this.isCondoClicked = !this.isCondoClicked;
  }

  onApartmentClick() {
    this.isApartmentClicked = !this.isApartmentClicked;
  }

  onHouseClick() {
    this.isHouseClicked = !this.isHouseClicked;
  }

  onStudioClick() {
    this.isStudioClicked = !this.isStudioClicked;
  }

  onPetsClicked() {
    this.isPetsClicked = !this.isPetsClicked;
  }

  onParkingClick() {
    this.isParkingClicked = !this.isParkingClicked;
  }

  onAppliancesClick() {
    this.isAppliancesClicked = !this.isAppliancesClicked;
  }

  onBalconyClick() {
    this.isBalconyClicked = !this.isBalconyClicked;
  }

  onAirClick() {
    this.isAirClicked = !this.isAirClicked;
  }

  onFurnishedClick() {
    this.isFurnishedClicked = !this.isFurnishedClicked;
  }

  onWifiClick() {
    this.isWifiClicked = !this.isWifiClicked;
  }

  onElevatorClick() {
    this.isElevatorClicked = !this.isElevatorClicked;
  }

  onDayClick() {
    this.isDayClicked = !this.isDayClicked;
  }

  onMonthClick() {
    this.isMonthClicked = !this.isMonthClicked;
  }

  search() {
    this.selectedType = [];
    this.selectedPeriod = [];
    if (this.isApartmentClicked)
      this.selectedType.push('apartment');

    if (this.isCondoClicked)
      this.selectedType.push('condo');

    if (this.isHouseClicked)
      this.selectedType.push('house');

    if (this.isStudioClicked)
      this.selectedType.push('studio');

    if (this.isDayClicked)
      this.selectedPeriod.push('day');

    if (this.isMonthClicked)
      this.selectedPeriod.push('month');

    if (this.selectedCountryName.length !== 0) {
      const countryCodeArray = this.selectedCountryName.split(",");
      if (countryCodeArray.length >= 2) {
        this.selectedCountryName = countryCodeArray[0].trim();
        this.selectedCountryCode = countryCodeArray[1].trim();
      }
    }

    const apartmentSearch: ApartmentSearch = {
      type: this.selectedType,
      period: this.selectedPeriod,
      isActive: true,
      minPrice: this.selectedMinPrice,
      maxPrice: this.selectedMaxPrice,
      minNumOfBedrooms: this.selectedMinNumOfBedrooms,
      maxNumOfBedrooms: this.selectedMaxNumOfBedrooms,
      minNumOfBathrooms: this.selectedMinNumOfBathrooms,
      maxNumOfBathrooms: this.selectedMaxNumOfBathrooms,
      minSquareMeters: this.selectedMinSquareMeters,
      maxSquareMeters: this.selectedMaxSquareMeters,
      countryName: this.selectedCountryName,
      countryCode: this.selectedCountryCode,
      cityName: this.selectedCityName,
      neighborhoodName: this.selectedNeighborhoodName,
      username: this.selectedUsername,
      availableFrom: this.selectedAvailableFrom,
      availableTo: this.selectedAvailableTo,
      parking: this.isParkingClicked ? 'Yes' : '',
      petsAllowed: this.isPetsClicked ? 'Yes' : '',
      balcony: this.isBalconyClicked ? 'Yes' : '',
      airConditioning: this.isAirClicked ? 'Yes' : '',
      furnished: this.isFurnishedClicked ? 'Yes' : '',
      wiFi: this.isWifiClicked ? 'Yes' : '',
      elevator: this.isElevatorClicked ? 'Yes' : '',
      appliances: this.isAppliancesClicked ? 'Yes' : ''
    };

    console.log(apartmentSearch);

    this.filterService.filter(apartmentSearch, 0).subscribe(
      (apartmentDTOs: ApartmentDTO[]) => {
        this.apartmentService.apartmentList = apartmentDTOs;
        this.apartmentService.generateRooms();
        this.filterService.isActive = false; //we close modal with this...
      }, (error) => {
        console.error(error);
      }
    );
    this.filterService.pageNo = 1;
  }
}