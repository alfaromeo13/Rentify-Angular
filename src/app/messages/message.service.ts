import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class MessageService {
    constructor(private httpClient: HttpClient) { }

    getAllConversations(): Observable<any> {
        const url = `${environment.apiUrl}/api/conversations`;
        return this.httpClient.get(url);
    }
}