import { AfterViewInit, Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ApartmentService } from "../apartment/apartment.service";
import * as L from 'leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import { HttpHeaders } from "@angular/common/http";
import { NeighbourhoodService } from "../services/neighbourhood.service";
import { debounceTime, of, switchMap } from "rxjs";
import { City } from "../models/city.model";
import { NeighborhoodDTO } from "../models/neighbourhood.model";
import { CityService } from "../city/city.service";
import { CountryService } from "../services/country.service";
import { Country } from "../models/country.model";
import { NotificationService } from "../services/notification.service";

@Component({
  selector: 'app-create-apartment',
  templateUrl: './create-apartment.component.html',
  styleUrls: ['./create-apartment.component.css']
})
export class CreateApartmentComponent implements OnInit, AfterViewInit {
  documents: any[] = [];
  apartmentForm: FormGroup;
  urls = new Array<string>();
  shouldLoad: boolean = false;
  private map: L.Map;
  private markerGroup: L.LayerGroup;
  longitude: number;
  latitude: number;
  period: string;
  propertyType: string;
  attributes: string[] = [];
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
  selectedCountryName: string = '';
  selectedCountryCode: string = '';
  selectedCityName: string = '';
  selectedNeighborhoodName: string = '';
  selectedNeighborhoodId: number = -1;

  countries: Country[] = [];
  cities: City[] = [];
  neighbourhoods: NeighborhoodDTO[] = [];
  countrySearchForm: FormGroup;
  citySearchForm: FormGroup;
  neighbourhoodSearchForm: FormGroup;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private apartmentService: ApartmentService,
    private cityService: CityService,
    private countryService: CountryService,
    public notificationService: NotificationService,
    private neighbourhoodService: NeighbourhoodService,
  ) { }


  ngOnInit(): void {
    L.Icon.Default.imagePath = "assets/leaflet/"
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.clearMarkers();

      this.latitude = event.latlng.lat;
      this.longitude = event.latlng.lng;

      const customIcon = L.icon({
        iconUrl: '/assets/house.png',
        iconSize: [50, 50],
        iconAnchor: [25, 25]
      });

      const marker = L.marker([this.latitude, this.longitude], { icon: customIcon }).addTo(this.map);
      marker.addTo(this.markerGroup);

      const circle = L.circle([this.latitude, this.longitude], {
        radius: 30,
        color: '#48c774',
        fillColor: '#48c774',
        fillOpacity: 0.5
      }).addTo(this.map);

      circle.addTo(this.markerGroup);
    });
  }

  private clearMarkers(): void {
    this.markerGroup.clearLayers();
  }

  onFileSelected(event: any): void {
    this.urls = [];
    this.documents = [];
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => this.urls.push(e.target.result);
        reader.readAsDataURL(file);
        this.documents.push(file);
      }
    }
  }

  private initializeForm(): void {
    this.apartmentForm = new FormGroup({
      title: new FormControl(null),
      description: new FormControl(null),
      sqMeters: new FormControl(null),
      price: new FormControl(null),
      numOfBedrooms: new FormControl(null),
      numOfBathrooms: new FormControl(null),
      number: new FormControl(null),
      street: new FormControl(null),
    });

    this.countrySearchForm = new FormGroup({
      searchTerm: new FormControl(null)
    });

    this.citySearchForm = new FormGroup({
      searchTerm: new FormControl({ value: null, disabled: true })
    });

    this.neighbourhoodSearchForm = new FormGroup({
      searchTerm: new FormControl({ value: null, disabled: true })
    });

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

  onDeleteImage(index: number) {
    // Remove the image from the urls array based on the index
    this.urls.splice(index, 1);
    this.documents.splice(index, 1);
  }

  addApartment() {
    if (this.documents.length == 0) {
      this.toastr.warning('Missing property images');
      return;
    }

    this.shouldLoad = true;
    if (this.isDayClicked)
      this.period = 'day';
    else if (this.isMonthClicked)
      this.period = 'month';
    if (this.isApartmentClicked)
      this.propertyType = 'Apartment';
    else if (this.isCondoClicked)
      this.propertyType = 'Condo';
    else if (this.isHouseClicked)
      this.propertyType = 'House';
    else if (this.isStudioClicked)
      this.propertyType = 'Studio';

    const payload = {
      title: this.apartmentForm.value.title,
      description: this.apartmentForm.value.description,
      sqMeters: this.apartmentForm.value.sqMeters,
      price: this.apartmentForm.value.price,
      numOfBedrooms: this.apartmentForm.value.numOfBedrooms,
      numOfBathrooms: this.apartmentForm.value.numOfBathrooms,
      number: this.apartmentForm.value.number,

      address: {
        street: this.apartmentForm.value.street,
        x: this.latitude,
        y: this.longitude,

        neighborhood: {
          id: this.selectedNeighborhoodId,
        }
      },

      period: {
        name: this.period,
      },

      propertyType: {
        name: this.propertyType,
      },

      apartmentAttributes: [
        {
          attribute: {
            name: "Balcony"
          },
          attributeValue: this.isBalconyClicked ? "Yes" : "No",
        },
        {
          attribute: {
            name: "Air Conditioning"
          },
          attributeValue: this.isAirClicked ? "Yes" : "No",
        },
        {
          attribute: {
            name: "Parking"
          },
          attributeValue: this.isParkingClicked ? "Yes" : "No",
        },
        {
          attribute: {
            name: "Appliances"
          },
          attributeValue: this.isAppliancesClicked ? "Yes" : "No",
        },
        {
          attribute: {
            name: "Elevator"
          },
          attributeValue: this.isElevatorClicked ? "Yes" : "No",
        },
        {
          attribute: {
            name: "Furnished"
          },
          attributeValue: this.isFurnishedClicked ? "Yes" : "No",
        },
        {
          attribute: {
            name: "Pets Allowed"
          },
          attributeValue: this.isPetsClicked ? "Yes" : "No",
        },
        {
          attribute: {
            name: "WiFi"
          },
          attributeValue: this.isWifiClicked ? "Yes" : "No",
        }
      ]
    };

    // Prepare the payload
    const formData = new FormData();
    formData.append('payload', JSON.stringify(payload));

    // Append the images
    if (this.documents) {
      for (const document of this.documents) {
        formData.append('images', document);
      }
    }

    // Set headers for multipart/form-data
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    this.apartmentService.createApartment(formData).subscribe(() => {
      this.shouldLoad = false;
      this.router.navigate(['home']);
      this.toastr.success('Apartment successfully sent for validation!');
    }, error => {
      this.shouldLoad = false;
    });
  }

  //at the beginning we initialize the map
  private initMap(): void {
    this.map = L.map('map', {
      center: [0, 0],
      zoom: 2,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 2,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    (L.Control as any).geocoder().addTo(this.map);
    this.markerGroup = L.layerGroup().addTo(this.map);
  }

  onCondoClick() {
    this.isCondoClicked = !this.isCondoClicked;
    this.isHouseClicked = false;
    this.isApartmentClicked = false;
    this.isStudioClicked = false;
  }

  onApartmentClick() {
    this.isApartmentClicked = !this.isApartmentClicked;
    this.isCondoClicked = false;
    this.isHouseClicked = false;
    this.isStudioClicked = false;
  }

  onHouseClick() {
    this.isHouseClicked = !this.isHouseClicked;
    this.isCondoClicked = false;
    this.isApartmentClicked = false;
    this.isStudioClicked = false;
  }

  onStudioClick() {
    this.isStudioClicked = !this.isStudioClicked;
    this.isHouseClicked = false;
    this.isCondoClicked = false;
    this.isApartmentClicked = false;
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
    this.isMonthClicked = false;
  }

  onMonthClick() {
    this.isMonthClicked = !this.isMonthClicked;
    this.isDayClicked = false;
  }

  onNeighbourhoodSelection() {
    const searchTermControl = this.neighbourhoodSearchForm.get('searchTerm');

    if (searchTermControl && searchTermControl.value) {
      const selectedNeighbourhood = this.neighbourhoods.find(neighbourhood =>
        neighbourhood.name === searchTermControl.value
      );
      this.selectedNeighborhoodId = selectedNeighbourhood ? selectedNeighbourhood.id : -1;
    } else {
      this.selectedNeighborhoodId = -1;
    }
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
}
