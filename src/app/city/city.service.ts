import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { CityWithCountry } from "../models/city-with-country.model";
import { City } from "../models/city.model";
@Injectable({ providedIn: 'root' })
export class CityService {

    constructor(private httpClient: HttpClient) { }

    searchByTerm(searchTerm: string): Observable<CityWithCountry[]> {
        const url = `${environment.apiUrl}city?page=0&size=5&name=${searchTerm}`;
        return this.httpClient.get<CityWithCountry[]>(url);
    }

    searchByCityAndCountry(cityName: string, selectedCountry: string): Observable<City[]> {
        const countryCodeArray = selectedCountry.split(",");
        const countryCode = countryCodeArray.length >= 2 ? countryCodeArray[1].trim() : '';
        const url = `${environment.apiUrl}city/by-country-code?page=0&size=5&countryCode=${countryCode}&cityName=${cityName}`;
        return this.httpClient.get<City[]>(url);
    }
}