import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { CityWithCountry } from "../models/city.model";
@Injectable({providedIn:'root'})
export class CityService{

    constructor(private httpClient: HttpClient) { }

    searchByTerm(searchTerm: string): Observable<CityWithCountry[]>{
        const url=`${environment.apiUrl}city?page=0&size=10&name=${searchTerm}`;
        return this.httpClient.get<CityWithCountry[]>(url);
    }
}