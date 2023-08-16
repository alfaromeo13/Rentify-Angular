import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApartmentService } from '../apartment/apartment.service';
import { FilterService } from '../filter/filter.service';
import { MessageService } from '../messages/message.service';
import { ApartmentDTO } from '../models/apartment.model';
import { CreateConversationDTO } from '../models/create-conversation.model';
import { RentalApartmentDTO } from '../models/rental-apartment.model';
import { ApartmentSearch } from '../models/search.model';
import { RentalService } from '../services/rental.service';
import * as moment from 'moment';
import { debounceTime } from 'rxjs';
import { NotificationService } from '../services/notification.service';

declare var bulmaCalendar: any;

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent implements OnInit {
  PAGE_TOLERANCE: number = 3;
  pageNo: number = 1;
  toDate: string;
  fromDate: string;
  rentals: RentalApartmentDTO[] = [];
  apartments: ApartmentDTO[] = [];
  username: string;
  propertyTitle: string;
  userSearchForm: FormGroup;
  propertySearchForm: FormGroup;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private filterService: FilterService,
    private rentalService: RentalService,
    private apartmentService: ApartmentService,
    public notificationService: NotificationService,
  ) { }

  set_page_no(newPageNo: number): void {
    if (newPageNo > 0) {
      this.apartments = [];
      this.pageNo = newPageNo;
      this.find(newPageNo - 1);
    }
  }

  openNewConversation(toUsername: string) {
    const conversation: CreateConversationDTO = {
      usernameFrom: 'johndoe',
      usernameTo: toUsername,
    };
    this.messageService.createNewConversation(conversation).subscribe((data: any) => {
      this.messageService.selectedConversationId = data.conversationId;
      this.router.navigate(['messages']);
    }, error => {
      console.log(error);
    });
  }

  find(pageNumber: number) {
    this.rentalService.getFiltered(pageNumber, this.toDate, this.fromDate, this.username, this.propertyTitle)
      .subscribe(data => {
        this.rentals = data;
        for (const dateTime of this.rentals) {
          const newStart = moment(dateTime.startDate, 'DD/MM/YYYY').add(1, 'days').toDate();
          const newEnd = moment(dateTime.endDate, 'DD/MM/YYYY').add(1, 'days').toDate();
          dateTime.startDate = moment(newStart).format('DD/MM/YYYY');;
          dateTime.endDate = moment(newEnd).format('DD/MM/YYYY');
        }

        const apartmentSearch: ApartmentSearch = { id: [] };

        for (const place of this.rentals)
          apartmentSearch.id?.push(place.apartmentId);

        if (this.rentals.length == 0)
          apartmentSearch.id?.push(-1);

        this.filterService.filter(apartmentSearch, 0).subscribe(
          (apartmentDTOs: ApartmentDTO[]) => {
            console.log(apartmentDTOs);
            this.apartments = apartmentDTOs;
          }, (error) => {
            console.error(error);
          }
        );
      });
  }

  findSpecificApartmentTitle(id: number) {
    for (const apartment of this.apartments) {
      if (apartment.id == id)
        return apartment.title;
    }
    return "";
  }

  findSpecificApartmentPropertyType(id: number) {
    for (const apartment of this.apartments) {
      if (apartment.id == id)
        return apartment.propertyType.name;
    }
    return "";
  }

  findSpecificApartmentAddressAndNeighbourhood(id: number) {
    for (const apartment of this.apartments) {
      if (apartment.id == id)
        return apartment.address.street + ' , ' + apartment.address.neighborhood.name;
    }
    return "";
  }

  ngOnInit(): void {
    const datepicker = document.getElementById('datepicker');
    const calendarOptions = {
      type: 'date',
      isRange: true,
      dateFormat: 'dd-MM-yyyy',
      timePicker: false,
    };

    const calendar = bulmaCalendar.attach(datepicker, calendarOptions)[0];
    calendar.on('select', (datepicker: any) => {
      this.fromDate = datepicker.data.datePicker._date.start;
      this.toDate = datepicker.data.datePicker._date.end;
      this.find(this.pageNo - 1);
    });

    this.find(0);
    this.initializeForm();

    this.userSearchForm.get('searchTerm')?.valueChanges
      .pipe(
        debounceTime(300),
      ).subscribe(data => {
        this.pageNo = 1;
        this.username = data;
        this.find(this.pageNo - 1);
      });

    this.propertySearchForm.get('searchTerm')?.valueChanges
      .pipe(
        debounceTime(300),
      ).subscribe(data => {
        this.pageNo = 1;
        this.propertyTitle = data;
        this.find(this.pageNo - 1);
      });
  }

  private initializeForm(): void {
    this.userSearchForm = new FormGroup({
      searchTerm: new FormControl(null)
    });

    this.propertySearchForm = new FormGroup({
      searchTerm: new FormControl(null)
    });
  }

  cancel(i: number): void {
    Swal.fire({
      title: 'Are you sure,cancelling a booking cannot be undone?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'gray',
      confirmButtonText: 'Cancel it',
      cancelButtonText: 'Go back'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rentals[i].status.name = 'cancelled'
        this.rentalService.cancel(this.rentals[i].id).subscribe(data => {
          console.log('cancelled rental..');
        }, error => {
          console.log(error);
        });
      }
    });
  }

  previewProperty(id: number) {
    this.apartmentService.setSelected(id);
  }
}