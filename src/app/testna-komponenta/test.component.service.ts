import { HttpHeaders } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class TestService {

  constructor(private httpClient: HttpClient) { }


//moramo promijeniti jos rutu samo 
  upload(formData: FormData): Observable<any> {
    const url = `${environment.apiUrl}/documents/upload`;
    return this.httpClient.post(url, formData, { observe: 'response' });
  }

  download(documentId: number): Observable<any> {
    const url = `${environment.apiUrl}/documents/download/${documentId}`;
    return this.httpClient.get(url, { observe: 'response', responseType: 'arraybuffer' });
  }

  getAll(): Observable<any> {
    const url = `${environment.apiUrl}/documents`;
    return this.httpClient.get(url, { headers: this.generateContentTypeHeaders() });
  }

  private generateContentTypeHeaders(){
    const httpHeaders=new HttpHeaders();
    httpHeaders.set('Content-Type','application/json');
    return httpHeaders;
  }
}