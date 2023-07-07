import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class MessageService {
    constructor(private httpClient: HttpClient) { }

    // kreiranje konverzacije
    // conversation => {usernameFrom: "", usernameTo: ""} (bez poruka, samo kreiranje)
    createNewConversation(conversation: any): Observable<any> {
        const url = `${environment.apiUrl}conversations`;
        return this.httpClient.post(url, conversation, {headers: {'Content-Type': 'application/json'}});
    }

    // izlistavanje svih konverzacija za ulogovanog korisnika
    getAllConversationsByUser(username: string): Observable<any> {
        const url = `${environment.apiUrl}conversations/by-user/${username}`;
        return this.httpClient.get(url, {headers: {'Content-Type': 'application/json'}});
    }

    // izlistavanje svih poruka za odredjenu konverzaciju
    getMessagesFromConversationById(conversationId: string): Observable<any> {
        const url = `${environment.apiUrl}conversations/${conversationId}/messages`;
        return this.httpClient.get(url, {headers: {'Content-Type': 'application/json'}});
    }

}