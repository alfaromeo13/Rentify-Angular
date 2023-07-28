import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ReviewApartmentDTO } from "../models/review-apartment.model";
import { ReviewDTO } from "../models/review.model";

@Injectable({ providedIn: 'root' })
export class ReviewService {

    isLowestClicked: boolean = false;
    isHighestClicked: boolean = false;
    isNewestClicked: boolean = false;


    constructor(
        private httpClient: HttpClient,
    ) { }

    //get reviews
    getReviews(apartmentId: number, pageNumber: number): Observable<ReviewDTO[]> {
        const url = `${environment.apiUrl}review/apartment-id/${apartmentId}`;
        let params = new HttpParams();
        params = params.set('page', pageNumber);
        params = params.set('size', 5);
        if (this.isLowestClicked)
            params = params.set('sort', 'grade,asc');
        else if (this.isHighestClicked)
            params = params.set('sort', 'grade,desc');
        else if (this.isNewestClicked)
            params = params.set('sort', 'createdAt,desc');
        return this.httpClient.get<ReviewDTO[]>(url, { params });
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