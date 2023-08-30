import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApartmentDTO } from '../models/apartment.model';
import * as L from 'leaflet';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageDTO } from '../models/image.model';
import { ReviewService } from './room-details.service';
import { ReviewDTO } from '../models/review.model';
import * as moment from 'moment';
import { AuthService } from '../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ReviewApartmentDTO } from '../models/review-apartment.model';
import { RentalService } from '../services/rental.service';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import { RentalApartmentDTO } from '../models/rental-apartment.model';
import { MessageService } from '../messages/message.service';
import { CreateConversationDTO } from '../models/create-conversation.model';
import { Router } from '@angular/router';
import { FilterService } from '../filter/filter.service';
import { ApartmentSearch } from '../models/search.model';

declare var bulmaCalendar: any;

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css']
})
export class RoomDetailsComponent implements OnInit {
  showLoader: boolean = true;
  pageNumber: number = 0;
  shownPrice: number = 0;
  reviews: ReviewDTO[] = [];
  brojSivih: any[] = []
  brojZlatnih: any[] = [];
  apartment: ApartmentDTO;
  isButtonDisabled: boolean = false;
  public imagePreviews: any[] = [];
  stars: number[] = [1, 2, 3, 4, 5];
  rental = new RentalApartmentDTO();
  invalidDates: Date[] = [];
  enteredText: string = ''
  highlightedStars: number = 0;
  selectedRating: number;
  showBounceAnimation: boolean = false;
  is1: boolean = false;
  is2: boolean = false;
  is3: boolean = false;
  is4: boolean = false;
  is5: boolean = false;
  private map: L.Map;

  constructor(
    private router: Router,
    private filterService: FilterService,
    private domSanitizer: DomSanitizer,
    public reviewService: ReviewService,
    private toastr: ToastrService,
    public authService: AuthService,
    private rentalService: RentalService,
    private messageService: MessageService,
  ) { }

  highlightStars(starCount: number): void {
    if (this.selectedRating === 0) {
      this.highlightedStars = starCount;
    }
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
    this.highlightedStars = 0;

    for (let i = 1; i <= rating; i++) {
      if (!this.is1) {
        this.is1 = true;
        continue;
      }
      if (!this.is2) {
        this.is2 = true;
        continue;
      }
      if (!this.is3) {
        this.is3 = true;
        continue;
      }
      if (!this.is4) {
        this.is4 = true;
        continue;
      }
      if (!this.is5) {
        this.is5 = true;
        continue;
      }
    }
    for (let i = rating; i < 5; i++) {
      if (i == 1) {
        this.is2 = false;
        this.is3 = false;
        this.is4 = false;
        this.is5 = false;
        continue;
      }
      if (i == 2) {
        this.is3 = false;
        this.is4 = false;
        this.is5 = false;
        continue;
      }
      if (i == 3) {
        this.is4 = false;
        this.is5 = false;
        continue;
      }
      if (i == 4) {
        this.is5 = false;
        continue;
      }
    }
  }

  toggleIcon(id: number): void {
    this.showBounceAnimation = true;
    setTimeout(() => {
      this.showBounceAnimation = false;
      this.reviewService.deleteById(id).subscribe(data => {
        const index = this.reviews.findIndex((review) => review.id === id);
        if (index !== -1) {
          this.reviews.splice(index, 1);
        }
      });
    }, 1000);
  }

  addReview() {
    if (this.authService.isAuthenticated.getValue()) {
      this.reviewService.addReview(new ReviewApartmentDTO(this.selectedRating, this.enteredText, this.apartment.id)).subscribe(data => {
        this.enteredText = "";
        this.toastr.success("Your review has been posted successfully!");
        this.getReviews();
      });
    } else this.toastr.info("You have to be logged in to add a review");
  }

  ngOnInit(): void {
    const storedData = localStorage.getItem('selectedApartmentId');
    if (storedData) {
      const ids = [parseInt(storedData, 10)];
      const search: ApartmentSearch = {
        id: ids,
      };

      this.filterService.filter(search, 0).subscribe(data => {
        this.apartment = data[0];
        console.log(this.apartment);
        this.getReviews();

        for (let i = 0; i < this.apartment.grade; i++)
          this.brojZlatnih.push(i);

        for (let i = 0; i < 5 - this.apartment.grade; i++)
          this.brojSivih.push(i);

        this.rentalService.getRentals(this.apartment.id).subscribe(data => {
          for (const disabled of data) {
            const startDate = new Date(disabled.startDate); // Convert the start date to a Date object
            const endDate = new Date(disabled.endDate); // Convert the end date to a Date object
            const modifiedStartDate = new Date(startDate.setDate(startDate.getDate() + 1));
            const modifiedEndDate = new Date(endDate.setDate(endDate.getDate() + 1))
            this.disableDatesBetween(modifiedStartDate, modifiedEndDate);
          }
          const datepicker = document.getElementById('datepicker');
          if (datepicker != null) {
            const today = new Date();
            const calendarOptions = {
              type: 'date',
              minDate: today.toISOString().split('T')[0],
              disabledDates: this.invalidDates,
              isRange: true,
              dateFormat: 'dd-MM-yyyy',
              timePicker: false,
            };
            const calendar = bulmaCalendar.attach(datepicker, calendarOptions)[0];

            calendar.on('select', (datepicker: any) => {
              const startDate = datepicker.data.datePicker._date.start
              const endDate = datepicker.data.datePicker._date.end;
              this.rental.apartmentId = this.apartment.id;
              this.rental.startDate = this.formatDate(startDate);
              this.rental.endDate = this.formatDate(endDate);
              this.rentalService.calculatePrice(this.rental).subscribe(data => {
                this.shownPrice = data;
              });
            });
          }
        }, error => {
          console.log('error');
        });

        this.apartment.images.forEach((image: ImageDTO) => {
          this.imagePreviews.push(
            this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image;base64, ${image.path}`));
        });
        this.showLoader = false;
        this.initMap();
      });
    }
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  book() {
    if (this.authService.isAuthenticated.value) {
      this.rentalService.book(this.rental).subscribe(data => {
        this.toastr.success('Apartment booked successfully!', 'Booking Confirmation');
      });
    } else this.toastr.info('You have to be logged in to book any property');
  }

  disableDatesBetween(start: Date, end: Date): void {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      this.invalidDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  containsAttribute(name: string): boolean {
    return this.apartment.apartmentAttributes.some(attr => attr.attribute.name === name && attr.attributeValue === "Yes");
  }

  getReviews() {
    this.reviewService.getReviews(this.apartment.id, this.pageNumber).subscribe(data => {
      this.reviews = data;
      this.isButtonDisabled = data.length < 5;

      for (const review of this.reviews) {
        review.createdAt = new Date(review.createdAt);
        review.localTime = moment(review.createdAt).format('DD/MM/YYYY, h:mm:ss A');
      }
    }, error => {
      console.log(error);
    });
  }

  loadMore() {
    this.pageNumber++;
    this.reviewService.getReviews(this.apartment.id, this.pageNumber).subscribe(data => {
      for (const review of data) {
        review.createdAt = new Date(review.createdAt);
        review.localTime = moment(review.createdAt).format('DD/MM/YYYY, h:mm:ss A');
      }
      this.reviews = this.reviews.concat(data);
      if (data.length < 5) this.isButtonDisabled = true;
    }, error => {
      console.log(error);
    });
  }

  onNewestClicked() {
    this.pageNumber = 0;
    this.reviewService.isNewestClicked = true;
    this.reviewService.isHighestClicked = false;
    this.reviewService.isLowestClicked = false;
    this.getReviews();
  }

  onHighestClicked() {
    this.pageNumber = 0;
    this.reviewService.isNewestClicked = false;
    this.reviewService.isHighestClicked = true;
    this.reviewService.isLowestClicked = false;
    this.getReviews();
  }

  onLowestCLicked() {
    this.pageNumber = 0;
    this.reviewService.isNewestClicked = false;
    this.reviewService.isHighestClicked = false;
    this.reviewService.isLowestClicked = true;
    this.getReviews();
  }

  // pozivas klikom na odredjeno dugme (nova konverzacija)
  openNewConversation(toUsername: string) {
    if (this.authService.username === toUsername) return;
    if (this.authService.isAuthenticated.value) {
      // usernameFrom => username trenutno ulogovanog korisnika
      // toUsername je username korisnika sa kojim zapocinjes konverzaciju
      const conversation: CreateConversationDTO = {
        usernameFrom: this.authService.username,
        usernameTo: toUsername,
      };
      this.messageService.createNewConversation(conversation).subscribe((data: any) => {
        this.messageService.selectedConversationId = data.conversationId;
        this.authService.subscribeToConversation(data.conversationId);
        this.router.navigate(['messages']);
      }, error => {
        console.log(error);
      });
    } else this.toastr.info('You have to be looged to send someone a message');
  }

  private initMap(): void {
    const centroid: L.LatLngExpression = [this.apartment.address.x, this.apartment.address.y];
    this.map = L.map('map', {
      center: centroid,
      zoom: 20
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    tiles.addTo(this.map);

    const customIcon = L.icon({
      iconUrl: '/assets/house.png',
      iconSize: [50, 50], // Set the dimensions of your icon image
      iconAnchor: [25, 25] // Set the anchor point of your icon relative to its size
    });

    L.marker(centroid, { icon: customIcon }).addTo(this.map);

    L.circle(centroid, {
      radius: 30,
      color: '#48c774', // Set the color to match Bulma's success class color
      fillColor: '#48c774', // Set the fill color to match Bulma's success class color
      fillOpacity: 0.5
    }).addTo(this.map);
  }
}