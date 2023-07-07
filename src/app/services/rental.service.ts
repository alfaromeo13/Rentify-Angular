import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { RentalApartmentDTO } from "../models/rental-apartment.model";
import { RentalSearchDTO } from "../models/rental-search.model";

@Injectable({ providedIn: 'root' })
export class RentalService {

    constructor(
        private httpClient: HttpClient,
    ) { }

    //get rentals
    getRentals(id: number): Observable<RentalSearchDTO[]> {
        const url = `${environment.apiUrl}rental/availability/${id}`;
        return this.httpClient.get<RentalSearchDTO[]>(url);
    }

    //get price
    calculatePrice(rentalApartmentDTO: RentalApartmentDTO): Observable<number> {
        const url = `${environment.apiUrl}rental/calculate-price`;
        return this.httpClient.post<number>(url, rentalApartmentDTO);
    }

    //book
    book(rentalApartmentDTO: RentalApartmentDTO): Observable<any> {
        const url = `${environment.apiUrl}rental/`;
        return this.httpClient.post(url, rentalApartmentDTO);
    }
}