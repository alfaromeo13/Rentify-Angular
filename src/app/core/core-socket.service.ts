import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, filter, map, take } from "rxjs";
import { environment } from "src/environments/environment";
import { Client } from '@stomp/stompjs';
import * as SockJS from "sockjs-client";
// import { WINDOW } from '@app/core/providers/window.provider';


@Injectable({
    providedIn: 'root' 
})
export class CoreSocketService {
    static connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private _stompClient: Client;
    private authHeader: any;
    private userHeader: any;

    static standardParse(data: any) {
        try {
            console.log('Received data: ', data);
            return JSON.parse(data.body);
        } catch (e) {
            console.log('error JSON parsing data.body');
            return {};
        }
    }

    static stringify(data: any) {
        try {
            return JSON.stringify(data); // {} =>  '{}' // application/json ~ plain text
        } catch (e) {
        console.log('Could not stringify object');
            return '';
        }
    }


    private get url() {
        return `http://localhost:8080/websocket/subscribe`; // ovdje ide tvoja ruta za CONNECT
    }

    static onConnect(callback: any) {
        if (callback) {
            callback();
        }
        CoreSocketService.connected.next(true);
    }

    static onStompError() {
        console.log('error');
    }

    getClient = () => this._stompClient;

    initConnection(callback?: () => void) {
        this._stompClient = new Client({
        webSocketFactory: () => {
            console.log(this.url);
            return new SockJS(this.url);
        },
        debug: function(str: any) {
            if (environment.production) {
                console.log(str);
            }
        },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000
        });

        this._stompClient.onConnect = CoreSocketService.onConnect.bind(this, callback);
        this._stompClient.onStompError = CoreSocketService.onStompError;
        this._stompClient.activate();
    }

    subscribe(url: string, callBack: (data?: any) => void) {
        return CoreSocketService.connected
            .pipe(
                filter((connectedSocket: any) => connectedSocket),
                take(1),
                map(() => this.getClient().subscribe(url, callBack))
            )
            .toPromise();
    }

    // ovdje je primjer kako se publish-uje poruka sa front-a na back
    sendMessageToConversation(destination: string, data: string) {
        this.getClient().publish({
            destination,
            body: data
        });
    }

    closeConnection() {
        if (this._stompClient) {
            CoreSocketService.connected.next(false);
            this._stompClient.deactivate();
        }
    }
}