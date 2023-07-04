import { Injectable } from "@angular/core";
import { CoreSocketService } from "./core-socket.service";

@Injectable({
    providedIn: 'root'
  })
  export class GlobalSocketService {
    constructor(private _ws: CoreSocketService) { }
  
    // primjer supskripcije na topic
    // initLicencingTopic(callback: any): any {
    //   return this._ws.subscribe(`/topic/product-license/user-limit`, (data: any) => {
    //     callback();
    //   });
    // }
  }