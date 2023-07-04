import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ReviewDTO } from "../models/review.model";

@Injectable({ providedIn: 'root' })
export class ReviewService {

    constructor(
        private httpClient: HttpClient,
    ) { }

    getReviews(id: number, pageNumber: number): Observable<ReviewDTO[]> {
        const url = `${environment.apiUrl}review/apartment-id/${id}?page=${pageNumber}&size=5`;
        return this.httpClient.get<ReviewDTO[]>(url);
    }

    //add review
}