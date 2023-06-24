import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ApartmentDTO } from "../models/apartment.model";
import { ApartmentSearch } from "../models/search.model";
import { HttpParams } from "@angular/common/http";
@Injectable({providedIn:'root'})
export class ApartmentService{

    constructor(private httpClient: HttpClient) { }

    searchByTerm(apartmentSearch: ApartmentSearch): Observable<ApartmentDTO[]>{
        const url = `${environment.apiUrl}apartment/pageable-search?page=0&size=9`;
        let params = new HttpParams();

        // Set search parameters from the ApartmentSearch object
        for (const [key, value] of Object.entries(apartmentSearch)) 
          if (value !== undefined) params = params.set(key, value.toString());
        
        return this.httpClient.get<ApartmentDTO[]>(url, { params });
      }


    // nextPage(pageNum: number,itemsPerPage:number): Observable<any>{
    //     const url=`${environment.apiUrl}product/pageable?page=${pageNum}&size=${itemsPerPage}`;
    //     return this.httpClient.get(url);
    // }
}