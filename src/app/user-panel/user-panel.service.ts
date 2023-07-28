import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class UserPanelService {

  constructor(private httpClient: HttpClient) { }

  deleteAccount(password: string): Observable<any> {
    const url = `${environment.apiUrl}user?password=${password}`;
    return this.httpClient.delete(url);
  }
}