import { Component, OnInit } from '@angular/core';
import { RoomShowcaseModel } from '../models/roomshowcase';
import { v4 as uuid } from 'uuid';
import { ApartmentService } from './apartment.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.css'],
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
]})
export class ApartmentComponent implements OnInit {
  isActive : boolean =false;
  pageNo : number = 10;
  PAGE_TOLERANCE : number = 3;
  MAX_PAGE : number = 30;
  apartmani : RoomShowcaseModel[] = [];

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
  isDayClicked : boolean = false;
  isMonthClicked : boolean = false;

  constructor(private apartmentService : ApartmentService) { }

  set_page_no(newPageNo:number):void{
    if(newPageNo>0 && newPageNo <= this.MAX_PAGE)
      this.pageNo = newPageNo;
  }

  ngOnInit(): void {
   this.apartmani=this.generateRooms();
  }

  public generateRooms(): RoomShowcaseModel[] {
       var rez = [];
    for (let item of [].constructor(10)) {
      var soba = new RoomShowcaseModel(uuid()+'', "Luxury apartment in downtown New York", "This is a luxurious apartment located in the heart of New York City", [
        "https://images1.apartments.com/i2/H2mjxvrJrDWsM4Jv4OI7Hnak9o1jBEKjp7JDn6QjYVg/116/montrose-at-buffalo-bayou-houston-tx-primary-photo.jpg?p=1",
        "https://images1.apartments.com/i2/6C30ug8dE1ObDYjKTiNzoqniGDOuKnMm0IM-2bIRd8o/116/woods-on-lamonte-houston-tx-primary-photo.jpg?p=1",
        "https://images1.apartments.com/i2/xF1Yyy9oUaJ7SUK3p20WteWidXGM2VkzcLvIpWN9uIs/116/the-cove-houston-tx-primary-photo.jpg?p=1"
      ], "10 murtovine 6, kuca 51", 69.69, 4.3);

      soba.liked =false;
      rez.push(soba);
    }
    return rez;
  }

  click(){ 
    this.isActive=!this.isActive;
  }

  cancel() { this.isActive=false; }

  // page: number = 1;//trenutna stranica na kojoj se nalazimo
  // itemsPerPage=3;
  // changePage(increase : number){
  //   this.page += increase;
  // }

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

  onPetsClicked(){
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

  onElevatorClick(){
    this.isElevatorClicked = !this.isElevatorClicked;
  }

  onDayClick(){
    this.isDayClicked = !this.isDayClicked;
  }

  onMonthClick(){
    this.isMonthClicked = !this.isMonthClicked;
  }
}