import { Component, OnInit } from '@angular/core';
import { ApartmentDTO } from '../models/apartment.model';
import * as L from 'leaflet';
import { AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApartmentService } from '../apartment/apartment.service';
import { ImageDTO } from '../models/image.model';
import { ReviewService } from './room-details.service';
import { ReviewDTO } from '../models/review.model';
import * as moment from 'moment';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css']
})
export class RoomDetailsComponent implements OnInit, AfterViewInit {

  pageNumber: number = 0;
  reviews: ReviewDTO[] = [];
  brojSivih: any[] = []
  brojZlatnih: any[] = [];
  apartment: ApartmentDTO;
  is1: boolean = false;
  is2: boolean = false;
  is3: boolean = false;
  is4: boolean = false;
  is5: boolean = false;
  isButtonDisabled: boolean = false;
  public imagePreviews: any[] = [];
  private map: L.Map;
  private centroid: L.LatLngExpression = [42.3601, -71.0589]; //Boston

  constructor(
    private domSanitizer: DomSanitizer,
    private reviewService: ReviewService,
    private apartmentService: ApartmentService,
  ) { }

  set1() {
    this.is1 = true;
  }

  set2() {
    this.set1();
    this.is2 = true;
  }

  set3() {
    this.set2();
    this.is3 = true;
  }

  set4() {
    this.set3();
    this.is4 = true;
  }

  set5() {
    this.set4();
    this.is5 = true;
  }

  ngOnInit(): void {

    this.apartment = this.apartmentService.selectedApartment;
    console.log(this.apartment.apartmentAttributes.length);
    this.getReviews();

    for (let i = 0; i < this.apartment.grade; i++) {
      this.brojZlatnih.push(i);
    }

    for (let i = 0; i < 5 - this.apartment.grade; i++) {
      this.brojSivih.push(i);
    }

    this.apartment.images.forEach((image: ImageDTO) => {
      this.imagePreviews.push(
        this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image;base64, ${image.path}`));
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }


  containsAttribute(name: string): boolean {
    for (let i = 0; i < this.apartment.apartmentAttributes.length; i++) {
      return this.apartment.apartmentAttributes[i].attribute.name === name;
    }
    return false;
  }

  getReviews() {
    this.reviewService.getReviews(this.apartment.id, this.pageNumber).subscribe(data => {
      this.reviews = data;
      if (data.length < 5) this.isButtonDisabled = true;
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

  private initMap(): void {
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 12
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // create 5 random jitteries and add them to map
    const jittery = Array(1).fill(this.centroid).map(
      x => [x[0] + (Math.random() - .5) / 10, x[1] + (Math.random() - .5) / 10]
    ).map(
      x => L.marker(x as L.LatLngExpression)
    ).forEach(
      x => x.addTo(this.map)
    );

    tiles.addTo(this.map);
  }
}