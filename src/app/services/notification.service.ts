import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { NotificationDTO } from "../models/notification.model";
@Injectable({ providedIn: 'root' })
export class NotificationService {

    isActive: boolean = false;
    notifications: NotificationDTO[] = [];

    constructor(private httpClient: HttpClient) { }

    getNotificationsForUser(): Observable<NotificationDTO[]> {
        const url = `${environment.apiUrl}notification`;
        let params = new HttpParams();
        params = params.set('page', 0);
        params = params.set('size', 10);
        return this.httpClient.get<NotificationDTO[]>(url, { params });
    }

    addNotification(notification: NotificationDTO): Observable<any> {
        const url = `${environment.apiUrl}notification`;
        return this.httpClient.post(url, notification);
    }

    deleteById(id: number): Observable<any> {
        const url = `${environment.apiUrl}notification/${id}`;
        return this.httpClient.delete(url);
    }
}