import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ApartmentDTO } from "../models/apartment.model";
import { ApartmentSearch } from "../models/search.model";
import { HttpParams } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class FilterService {

  pageNo: number = 1;
  isActive: boolean = false;
  sort: string = 'Choose value';
  apartmentSearch: ApartmentSearch; //we memorize last search specification

  constructor(
    private httpClient: HttpClient) { }

  filter(apartmentSearch: ApartmentSearch, pageNumber: number): Observable<ApartmentDTO[]> {
    const url = `${environment.apiUrl}apartment/pageable-search?page=${pageNumber}&size=9`;
    //&sort=price,desc
    let params = new HttpParams();
    this.apartmentSearch = apartmentSearch;

    if (this.sort.trim() === 'Price (Low to High)') {
      params.set('sort', 'price,asc');
    } else if (this.sort.trim() === 'Price (High to Low)') {
      params.set('sort', 'price,desc');
    } else if (this.sort.trim() === 'Ratings (High to Low)') {
      params.set('ratings', ',desc');
    }

    
    // Set search parameters from the ApartmentSearch object
    for (const [key, value] of Object.entries(apartmentSearch))
      if (value !== undefined) params = params.set(key, value.toString());

    return this.httpClient.get<ApartmentDTO[]>(url, { params });
  }
}