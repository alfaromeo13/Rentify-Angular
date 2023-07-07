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
    const url = `${environment.apiUrl}apartment/pageable-search`;
    let params = new HttpParams();
    this.apartmentSearch = apartmentSearch;
    params = params.set('page', pageNumber);
    params = params.set('size', 9);
    if (this.sort.trim() === 'Price (Low to High)')
      params = params.set('sort', 'price,asc');
    else if (this.sort.trim() === 'Price (High to Low)')
      params = params.set('sort', 'price,desc');
    else if (this.sort.trim() === 'Ratings (Low to High)')
      params = params.set('sort', 'grade,asc');
    else if (this.sort.trim() === 'Ratings (High to Low)')
      params = params.set('sort', 'grade,desc');

    // Set search parameters from the ApartmentSearch object
    for (const [key, value] of Object.entries(apartmentSearch))
      if (value !== undefined) params = params.set(key, value.toString());

    return this.httpClient.get<ApartmentDTO[]>(url, { params });
  }
}