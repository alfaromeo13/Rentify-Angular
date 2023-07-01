import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ImagePreview } from "../models/imagepreview.model.";

@Injectable({providedIn:'root'})
export class ImageService{

    constructor(
        private httpClient: HttpClient
    ){}
 
    getImagePreview(id : number): Observable<ImagePreview> {
        const url = `${environment.apiUrl}image/preview/${id}`;
        return this.httpClient.get<ImagePreview>(url);//ImagePreview is what we expect in response
    }
}