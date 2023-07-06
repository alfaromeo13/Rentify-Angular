import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class MessageService {
    constructor(private httpClient: HttpClient) { }

    // conversation => {usernameFrom: "", usernameTo: ""} (bez poruka, samo kreiranje)
    createNewConversation(conversation: any): Observable<any> {
        const url = `${environment.apiUrl}/api/conversations`;
        return this.httpClient.post(url, conversation, {headers: {'Content-Type': 'application/json'}});
    }

    getAllConversationsByUser(username: string): Observable<any> {
        const url = `${environment.apiUrl}/api/conversations/by-user/${username}`;
        return this.httpClient.get(url, {headers: {'Content-Type': 'application/json'}});
    }

    getMessagesFromConversationById(conversationId: string): Observable<any> {
        const url = `${environment.apiUrl}/api/conversations/${conversationId}/messages`;
        return this.httpClient.get(url, {headers: {'Content-Type': 'application/json'}});
    }

}