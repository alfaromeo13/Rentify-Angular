import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { CreateConversationDTO } from "../models/create-conversation.model";
import { MessageDTO } from "../models/message.model";
import { RedisConversation } from "../models/redis-conversation.model";

@Injectable({ providedIn: 'root' })
export class MessageService {

    insideMessages: boolean = false;
    selectedConversationId: string = '';
    conversations: RedisConversation[] = []; // lista konverzacija
    currentMessages: MessageDTO[] = []; //poruke za trenutno kliknutu konverzaciju

    constructor(private httpClient: HttpClient) { }

    // kreiranje konverzacije
    // conversation => {usernameFrom: "", usernameTo: ""} (bez poruka, samo kreiranje)
    createNewConversation(conversation: CreateConversationDTO): Observable<any> {
        const url = `${environment.apiUrl}conversations/`;
        return this.httpClient.post(url, conversation, { headers: { 'Content-Type': 'application/json' } });
    }

    // izlistavanje svih konverzacija za ulogovanog korisnika
    getAllConversationsByUser(): Observable<RedisConversation[]> {
        const url = `${environment.apiUrl}conversations/by-user`;
        return this.httpClient.get<RedisConversation[]>(url, { headers: { 'Content-Type': 'application/json' } });
    }

    // izlistavanje svih poruka za odredjenu konverzaciju
    getMessagesFromConversationById(conversationId: string): Observable<MessageDTO[]> {
        const url = `${environment.apiUrl}conversations/${conversationId}/messages`;
        return this.httpClient.get<MessageDTO[]>(url, { headers: { 'Content-Type': 'application/json' } });
    }

    //we send images through http request not through websoket connection
    sendImages(images: File[]): Observable<any> {
        const url = `${environment.apiUrl}image/${this.selectedConversationId}`;
        const formData = new FormData();
        formData.append('conversationId', this.selectedConversationId);
        for (const image of images)
            formData.append('images', image);
        return this.httpClient.post(url, formData);
    }
}