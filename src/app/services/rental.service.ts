import { HttpClient, HttpParams } from "@angular/common/http";
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

    //book ~ post
    book(rentalApartmentDTO: RentalApartmentDTO): Observable<any> {
        const url = `${environment.apiUrl}rental/`;
        return this.httpClient.post(url, rentalApartmentDTO);
    }

    //get incomes
    getIncomes(): Observable<number[]> {
        const url = `${environment.apiUrl}rental/monthly-incomes`;
        return this.httpClient.get<number[]>(url);
    }

    //get visited apartments for specific user
    getVisited(page: number): Observable<RentalApartmentDTO[]> {
        const url = `${environment.apiUrl}rental/for-user?page=${page}&size=9`;
        return this.httpClient.get<RentalApartmentDTO[]>(url);
    }

    //camcel specific rental
    cancel(id: number): Observable<any> {
        const url = `${environment.apiUrl}rental/cancel/${id}`;
        return this.httpClient.delete(url);
    }

    //filter by conditions
    getFiltered(page: number, to?: string, from?: string, username?: string, propertyTitle?: string)
        : Observable<RentalApartmentDTO[]> {

        let queryParams = new HttpParams()
            .set('page', String(page))
            .set('size', '15');

        if (to) queryParams = queryParams.set('to', to);
        if (from) queryParams = queryParams.set('from', from);
        if (username) queryParams = queryParams.set('username', username);
        if (propertyTitle) queryParams = queryParams.set('propertyTitle', propertyTitle);

        const url = `${environment.apiUrl}rental/filter`;
        return this.httpClient.get<RentalApartmentDTO[]>(url, { params: queryParams });
    }
}