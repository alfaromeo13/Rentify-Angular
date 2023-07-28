import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { UserDTO } from "../models/user.model";

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private httpClient: HttpClient) { }

    getAll(): Observable<UserDTO[]> {
        const url = `${environment.apiUrl}admin/all-users?page=0&size=25`;
        return this.httpClient.get<UserDTO[]>(url);
    }

    deleteById(id: number): Observable<any> {
        const url = `${environment.apiUrl}admin/user/${id}`;
        return this.httpClient.delete(url);
    }

    activateById(id: number): Observable<any> {
        const url = `${environment.apiUrl}admin/user/${id}`;
        return this.httpClient.put(url, null);
    }

    findByUsername(username: string): Observable<UserDTO[]> {
        const url = `${environment.apiUrl}admin/users-by-username/${username}?page=0&size=25`;
        return this.httpClient.get<UserDTO[]>(url);
    }
}