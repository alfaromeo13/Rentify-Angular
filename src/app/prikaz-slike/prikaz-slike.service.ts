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
 
    getImagePreview(): Observable<ImagePreview> {
        const url = `${environment.apiUrl}image/preview/107`;//id nije fixan!
        return this.httpClient.get<ImagePreview>(url);//ImagePreview is what we expect in response
    }
}