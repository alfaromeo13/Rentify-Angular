import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ApartmentDTO } from "../models/apartment.model";

@Injectable({ providedIn: 'root' })
export class AdminService {

    apartmentList: ApartmentDTO[] = [];

    constructor(private httpClient: HttpClient) { }

    getNumbers(): Observable<any> {
        const url = `${environment.apiUrl}admin/magic-numbers`;
        return this.httpClient.get<any>(url);
    }

    getNumberOfUsers(): Observable<number> {
        const url = `${environment.apiUrl}admin/num-of-users`;
        return this.httpClient.get<number>(url);
    }

    removeApartment(id: number): Observable<any> {
        const url = `${environment.apiUrl}admin/approve/${id}`;
        return this.httpClient.delete(url);
    }

    approveApartmentById(id: number): Observable<any> {
        const url = `${environment.apiUrl}admin/approve/${id}`;
        return this.httpClient.put(url, null);
    }
}