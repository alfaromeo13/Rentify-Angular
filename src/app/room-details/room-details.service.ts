import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ReviewApartmentDTO } from "../models/review-apartment.model";
import { ReviewDTO } from "../models/review.model";

@Injectable({ providedIn: 'root' })
export class ReviewService {

    constructor(
        private httpClient: HttpClient,
    ) { }

    //get reviews
    getReviews(id: number, pageNumber: number): Observable<ReviewDTO[]> {
        const url = `${environment.apiUrl}review/apartment-id/${id}?page=${pageNumber}&size=5`;
        return this.httpClient.get<ReviewDTO[]>(url);
    }

    //add review
    addReview(review: ReviewApartmentDTO): Observable<any> {
        const url = `${environment.apiUrl}review`;
        return this.httpClient.post(url, review);
    }

    //delete review
    deleteById(id: number): Observable<any> {
        const url = `${environment.apiUrl}review/${id}`;
        return this.httpClient.delete(url);
    }
}