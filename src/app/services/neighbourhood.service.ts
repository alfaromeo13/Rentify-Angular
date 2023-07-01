import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { NeighborhoodDTO } from "../models/neighbourhood.model";
@Injectable({ providedIn: 'root' })
export class NeighbourhoodService {

    constructor(private httpClient: HttpClient) { }

    searchByCityAndNeighborhoodName(neighborhoodName: string, selectedCityName: string): Observable<NeighborhoodDTO[]> {
        const url = `${environment.apiUrl}neighborhood?page=0&size=10&cityName=${selectedCityName}&neighborhoodName=${neighborhoodName}`;
        return this.httpClient.get<NeighborhoodDTO[]>(url);
    }
}