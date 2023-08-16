import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Country } from "../models/country.model";
@Injectable({providedIn:'root'})
export class CountryService{

    constructor(private httpClient: HttpClient) { }

    searchByTerm(searchTerm: string): Observable<Country[]>{
        const url=`${environment.apiUrl}country/by-country?page=0&size=5&name=${searchTerm}`;
        return this.httpClient.get<Country[]>(url);
    }
}