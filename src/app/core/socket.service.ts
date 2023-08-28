import { Injectable } from "@angular/core";
import { CoreSocketService } from "./core-socket.service";

@Injectable({
  providedIn: 'root'
})
export class GlobalSocketService {
  //ova klasa se nadogradjuje sa potrebnim metodama i sluzi kao Proxy klasa.CoreSocket
  //ima pravu logiku za subscripciju,parsiranje payloada,publishovanje poruke i slicno...
  //CoreSocket ne diramo vise
  constructor(private _ws: CoreSocketService) { }

  //here we subscribe to specific topic
  subscribe(topic: string, callback: any): any {
    return this._ws.subscribe(topic, (data: any) => {
      callback(data);
    });
  }

  sendMessageToConversation(destination: string, payload: any) {
    // moze se preimenovati u sendMessage jer se destination proslijedjuje kao parametar
    return this._ws.sendMessageToConversation(destination, CoreSocketService.stringify(payload));
  }
}