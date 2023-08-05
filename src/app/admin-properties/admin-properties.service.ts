import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ApartmentDTO } from "../models/apartment.model";
import { ApartmentSearch } from "../models/search.model";
import { HttpParams } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class AdminPropertiesService {

    selectedType: string = '';

    constructor(private httpClient: HttpClient) { }

    enableOrDisable(id: number): Observable<any> {
        const url = `${environment.apiUrl}admin/apartment/${id}`;
        return this.httpClient.put(url, null);
    }

    findProperties(apartmentSearch: ApartmentSearch): Observable<ApartmentDTO[]> {
        const url = `${environment.apiUrl}apartment/pageable-search`;
        let params = new HttpParams();
        params = params.set('page', 0);
        params = params.set('size', 6);
        // Set search parameters from the ApartmentSearch object
        for (const [key, value] of Object.entries(apartmentSearch))
            if (value !== undefined) params = params.set(key, value.toString());
        return this.httpClient.get<ApartmentDTO[]>(url, { params });
    }
}