import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
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
import { ApartmentSearch } from "../models/search.model";
import { FilterService } from "../filter/filter.service";
import { ApartmentDTO } from "../models/apartment.model";
import Swal from "sweetalert2";
import { ImageDTO } from "../models/image.model";
import { DomSanitizer } from "@angular/platform-browser";
import { NotificationService } from "../services/notification.service";

@Component({
  selector: 'app-update-apartment',
  templateUrl: './update-apartment.component.html',
  styleUrls: ['./update-apartment.component.css']
})
export class UpdateApartmentComponent implements OnInit {
  documents: any[] = [];
  deletedImages: number[] = [];
  apartmentForm: FormGroup;
  shouldLoad: boolean = false;
  showNotification: boolean = true;
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
  selectedNeighborhoodId: number;
  oldImages: any[] = [];
  newImages: any[] = [];
  countries: Country[] = [];
  cities: City[] = [];
  neighbourhoods: NeighborhoodDTO[] = [];
  countrySearchForm: FormGroup;
  citySearchForm: FormGroup;
  neighbourhoodSearchForm: FormGroup;
  apartment: ApartmentDTO;

  constructor(
    private router: Router,
    private domSanitizer: DomSanitizer,
    private filterService: FilterService,
    private toastr: ToastrService,
    private apartmentService: ApartmentService,
    private cityService: CityService,
    private countryService: CountryService,
    public notificationService: NotificationService,
    private neighbourhoodService: NeighbourhoodService,
  ) { }


  ngOnInit(): void {
    this.initializeForm();

    const storedData = localStorage.getItem('selectedApartmentIdForUpdate');
    if (storedData) {
      const ids = [parseInt(storedData, 10)];
      const search: ApartmentSearch = {
        id: ids,
      };

      this.filterService.filter(search, 0).subscribe(data => {
        this.apartment = data[0];
        console.log(this.apartment);
        this.apartmentForm.get('title')?.setValue(this.apartment.title);
        this.apartmentForm.get('description')?.setValue(this.apartment.description);
        this.apartmentForm.get('sqMeters')?.setValue(this.apartment.sqMeters);
        this.apartmentForm.get('price')?.setValue(this.apartment.price);
        this.apartmentForm.get('numOfBedrooms')?.setValue(this.apartment.numOfBedrooms);
        this.apartmentForm.get('numOfBathrooms')?.setValue(this.apartment.numOfBathrooms);
        this.apartmentForm.get('number')?.setValue(this.apartment.number);
        this.apartmentForm.get('street')?.setValue(this.apartment.address.street);
        if (this.apartment.period.name === 'day')
          this.isDayClicked = true;
        else if (this.apartment.period.name === 'month')
          this.isMonthClicked = true;
        if (this.apartment.propertyType.name === 'Apartment')
          this.isApartmentClicked = true;
        else if (this.apartment.propertyType.name === 'Condo')
          this.isCondoClicked = true;
        else if (this.apartment.propertyType.name === 'House')
          this.isHouseClicked = true;
        else if (this.apartment.propertyType.name === 'Studio')
          this.isStudioClicked = true;
        for (const attribute of this.apartment.apartmentAttributes) {
          if (attribute.attribute.name === 'Balcony' && attribute.attributeValue === 'Yes')
            this.isBalconyClicked = true;
          else if (attribute.attribute.name === 'Air Conditioning' && attribute.attributeValue === 'Yes')
            this.isAirClicked = true;
          else if (attribute.attribute.name === 'Parking' && attribute.attributeValue === 'Yes')
            this.isParkingClicked = true;
          else if (attribute.attribute.name === 'Appliances' && attribute.attributeValue === 'Yes')
            this.isAppliancesClicked = true;
          else if (attribute.attribute.name === 'Elevator' && attribute.attributeValue === 'Yes')
            this.isElevatorClicked = true;
          else if (attribute.attribute.name === 'Furnished' && attribute.attributeValue === 'Yes')
            this.isFurnishedClicked = true;
          else if (attribute.attribute.name === 'Pets Allowed' && attribute.attributeValue === 'Yes')
            this.isPetsClicked = true;
          else if (attribute.attribute.name === 'WiFi' && attribute.attributeValue === 'Yes')
            this.isWifiClicked = true;
        }
        this.neighbourhoodSearchForm.get('searchTerm')?.setValue(this.apartment.address.neighborhood.name);
        this.citySearchForm.get('searchTerm')?.setValue(this.apartment.address.neighborhood.city.name);
        this.countrySearchForm.get('searchTerm')?.setValue(this.apartment.address.neighborhood.city.country.name + " , " + this.apartment.address.neighborhood.city.country.shortCode);
        this.selectedNeighborhoodId = this.apartment.address.neighborhood.id;
        this.initMap();

        this.apartment.images.forEach((image: ImageDTO) => {
          image.display = this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image;base64, ${image.path}`)
          this.oldImages.push(image);
        });
      });
    }
  }

  private clearMarkers(): void {
    this.markerGroup.clearLayers();
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => this.newImages.push(new ImageDTO(e.target.result));
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

  onDeleteOldImages(id: number, index: number) {
    this.deletedImages.push(id);
    this.oldImages.splice(index, 1);
  }

  onDeleteNewImages(index: number) {
    this.documents.splice(index, 1);
    this.newImages.splice(index, 1);
  }

  updateApartment() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Your property will become unavailable until approval",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
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
              id: this.findByAttributeName("Balcony"),
              attribute: {
                name: "Balcony"
              },
              attributeValue: this.isBalconyClicked ? "Yes" : "No",
            },
            {
              id: this.findByAttributeName("Air Conditioning"),
              attribute: {
                name: "Air Conditioning"
              },
              attributeValue: this.isAirClicked ? "Yes" : "No",
            },
            {
              id: this.findByAttributeName("Parking"),
              attribute: {
                name: "Parking"
              },
              attributeValue: this.isParkingClicked ? "Yes" : "No",
            },
            {
              id: this.findByAttributeName("Appliances"),
              attribute: {
                name: "Appliances"
              },
              attributeValue: this.isAppliancesClicked ? "Yes" : "No",
            },
            {
              id: this.findByAttributeName("Elevator"),
              attribute: {
                name: "Elevator"
              },
              attributeValue: this.isElevatorClicked ? "Yes" : "No",
            },
            {
              id: this.findByAttributeName("Furnished"),
              attribute: {
                name: "Furnished"
              },
              attributeValue: this.isFurnishedClicked ? "Yes" : "No",
            },
            {
              id: this.findByAttributeName("Pets Allowed"),
              attribute: {
                name: "Pets Allowed"
              },
              attributeValue: this.isPetsClicked ? "Yes" : "No",
            },
            {
              id: this.findByAttributeName("WiFi"),
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

        // Append newly added the images
        if (this.documents) {
          for (const document of this.documents)
            formData.append('newImages', document);
        }

        if (this.deletedImages) {
          for (const id of this.deletedImages)
            formData.append('deletedImages', id + ""); //RADI LI OVO?
        }

        // Set headers for multipart/form-data
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');

        this.apartmentService.updateApartment(formData, this.apartment.id).subscribe(() => {
          this.shouldLoad = false;
          this.router.navigate(['my-properties']);
          this.toastr.success('Apartment successfully sent for validation!');
        }, error => {
          this.shouldLoad = false;
        });
      }
    });
  }

  findByAttributeName(attributeName: string): number {
    for (const apartmentAttribute of this.apartment.apartmentAttributes) {
      if (apartmentAttribute.attribute.name === attributeName)
        return apartmentAttribute.id;
    }
    return 0;
  }

  //at the beginning we initialize the map
  private initMap(): void {
    L.Icon.Default.imagePath = "assets/leaflet/"
    const centroid: L.LatLngExpression = [this.apartment.address.x, this.apartment.address.y];
    this.map = L.map('map', {
      center: centroid,
      zoom: 20
    });

    this.latitude = this.apartment.address.x;
    this.longitude = this.apartment.address.y;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 2,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: '/assets/house.png',
      iconSize: [50, 50], // Set the dimensions of your icon image
      iconAnchor: [25, 25] // Set the anchor point of your icon relative to its size
    });

    const marker = L.marker(centroid, { icon: customIcon }).addTo(this.map);

    const circle = L.circle(centroid, {
      radius: 30,
      color: '#48c774', // Set the color to match Bulma's success class color
      fillColor: '#48c774', // Set the fill color to match Bulma's success class color
      fillOpacity: 0.5
    }).addTo(this.map);

    (L.Control as any).geocoder().addTo(this.map);
    this.markerGroup = L.layerGroup().addTo(this.map);

    marker.addTo(this.markerGroup);
    circle.addTo(this.markerGroup);

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
    console.log(this.isWifiClicked);
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

  hide() {
    this.showNotification = false;
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