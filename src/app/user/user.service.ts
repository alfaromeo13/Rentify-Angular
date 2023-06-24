import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "./user.model";

@Injectable({providedIn:'root'})
export class UserService{
    constructor(private httpClient: HttpClient){}

    getAll() :Observable<User[]>{
        const url=`${environment.apiUrl}admin/all-users`;
        return this.httpClient.get<User[]>(url) //mozemo .get() .post() .delete() ...
    }

    deleteById(id :number): Observable<any>{
        const url=`${environment.apiUrl}admin/user/${id}`;
        return this.httpClient.delete(url);
    }

    activateById(id: number): Observable<any>{
        const url=`${environment.apiUrl}admin/user/${id}`;
        return this.httpClient.put(url,null);
    }
}