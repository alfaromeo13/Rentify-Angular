import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Login } from "../models/login.model";
import { JwtToken } from "../models/jwt.model";
import { BehaviorSubject } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import { Register } from "../models/register.model";
import { ToastrService } from "ngx-toastr";
import { CoreSocketService } from "src/app/core/core-socket.service";
import { GlobalSocketService } from "src/app/core/socket.service";
import { MessageService } from "src/app/messages/message.service";
import { MessageDTO } from "src/app/models/message.model";
import * as moment from "moment";
import { RedisConversation } from "src/app/models/redis-conversation.model";
import { NavbarService } from "src/app/navbar/navbar.service";
import { ApartmentDTO } from "src/app/models/apartment.model";
import { AdminService } from "src/app/admin/admin.service";
import { NotificationDTO } from "src/app/models/notification.model";
import { NotificationService } from "src/app/services/notification.service";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthService {

    username: string = "";
    isAuthenticated = new BehaviorSubject<boolean>(false);

    constructor(
        private router: Router,
        private toastr: ToastrService,
        private httpClient: HttpClient,
        private adminService: AdminService,
        private navbarService: NavbarService,
        private messageService: MessageService,
        private socketService: GlobalSocketService,
        private coreSocketService: CoreSocketService,
        private notificationService: NotificationService,
        private globalSocketService: GlobalSocketService) { }

    //this is our login
    authenticate(loginData: Login): Observable<any> {
        const url = `${environment.apiUrl}authenticate/login`;
        //JwtToken is what we expect in response
        return this.httpClient.post<JwtToken>(url, loginData)
            .pipe(tap(responseData => {
                this.username = loginData.username;
                localStorage.setItem('username', this.username);
                const access = responseData.token;
                const refresh = responseData["refresh-token"];
                localStorage.setItem('access-token', access);
                localStorage.setItem('refresh-token', refresh);
                this.isAuthenticated.next(true);//user is logged in
                this.openWS();
            }));
    }

    openWS() {
        //otvaramo web soket ka bekendu
        this.coreSocketService.initConnection();
        //nakon toga se subscribujemo na topic i slusamo na dolazece konverzacije za nas username
        const topic = `/topic/incoming-conversation/${this.username}`;
        this.globalSocketService.subscribe(topic, (data: any) => {
            console.log(data); // vraca se kompletan conversation objekat
            const payload = JSON.parse(data.body);
            //dobili smo notifikaciju da je neko poceo konverzaciju sa nama
            //pa se subscribujemo na tu konverzaciju
            this.subscribeToConversation(payload.id);

            const conversation: RedisConversation = {
                id: payload.id,
                usernameFrom: payload.usernameFrom,
                usernameTo: payload.usernameTo,
                createdAt: payload.createdAt,
                isOpened: payload.isOpened,
                messages: payload.messages,
            };

            conversation.isClicked = conversation.id === this.messageService.selectedConversationId ? true : false;
            conversation.localTime = moment(conversation.createdAt).format('DD/MM/YYYY, h:mm:ss A');

            if (conversation.usernameFrom !== this.username)
                conversation.showNotification = true;

            this.messageService.conversations.push(conversation);
        });

        if (this.username === 'johndoe') {
            this.globalSocketService.subscribe("/topic/created-apartment", (data: any) => {
                const apartment: ApartmentDTO = JSON.parse(data.body);
                this.toastr.info('You have new pending properties');
                this.adminService.apartmentList.push(apartment);
            });
        }

        this.globalSocketService.subscribe("/topic/notification", (data: any) => {
            const notification: NotificationDTO = JSON.parse(data.body);
            if (notification.receiverUsername === this.username) {
                console.log('stigla je notifikacija');
                if (this.username === 'johndoe')
                    this.toastr.warning('You have new reports');
                else
                    this.toastr.info('You have new notifications');
                this.notificationService.notifications.push(notification);
            }
        });

        //subscribuj se na sve ranije userove konverzacije
        //u ovom trenutku ce se dodati u interceptoru nas token
        //jer smo u securitiju zabtranili neautorizovan pristup za ove apije 
        this.previewAllConversationsForCurrentUser();
    }
    //prikazujemo sve konverzacije i subscribujemo se na sve njih
    previewAllConversationsForCurrentUser() {
        this.messageService.conversations = [];
        this.messageService
            .getAllConversationsByUser()
            .subscribe((data: RedisConversation[]) => {
                if (data.length > 0) {
                    for (const conversation of data) {
                        if (conversation.messages.length == 0) continue;
                        this.messageService.conversations.push(conversation);
                        conversation.isClicked = conversation.id === this.messageService.selectedConversationId ? true : false;
                        conversation.localTime = moment(conversation.createdAt).format('DD/MM/YYYY, h:mm:ss A');
                        conversation.showNotification =
                            !conversation.isOpened && conversation.messages[conversation.messages.length - 1].sender !== this.username;
                        if (!conversation.isOpened && conversation.messages[conversation.messages.length - 1].sender !== this.username)
                            this.navbarService.newMessages = true;
                        this.subscribeToConversation(conversation.id);
                    }
                }
            });
    }

    //receive messages
    subscribeToConversation(conversationId: string) {
        const topic = `/topic/conversation/${conversationId}`;
        console.log('Subscribovali smo se na konverzaciju:', conversationId)
        this.socketService.subscribe(topic, (data: any) => {

            if (!this.messageService.insideMessages)
                this.toastr.info('You have new incoming messages');

            // 'data' je poruka koju si primio preko socket-a 
            // poslata od strane drugog korisnika (ili od tebe)
            //tj ovo nam je poslao bekend na ovaj topic na kojem slusamo
            const payload = JSON.parse(data.body); // Parse the JSON string to get the conversation object
            //ako je poruka za selektovanu konverzaciju dodaj je na prozor

            const message: MessageDTO = {
                timestamp: payload.timestamp,
                message: payload.message,
                sender: payload.sender,
                localTime: moment(payload.timestamp).format('DD/MM/YYYY, h:mm:ss A'),
            }

            if (this.messageService.selectedConversationId == conversationId)
                this.messageService.currentMessages.push(message);

            this.navbarService.newMessages = true;
            this.navbarService.usernameFrom = message.sender;

            for (const conversation of this.messageService.conversations) {
                if (conversation.id === conversationId && this.messageService.selectedConversationId !== conversation.id) {
                    conversation.showNotification = true;
                    conversation.isOpened = false;
                    break;
                }
            }
        });
    }

    register(registerData: Register) {
        const url = `${environment.apiUrl}authenticate/register`;
        return this.httpClient.post<JwtToken>(url, registerData)
    }

    resetPassword(mail: string): void {
        const url = `${environment.apiUrl}authenticate/request-reset-password`;
        const params = { mail: mail };
        this.httpClient.post(url, null, { params, responseType: 'text' })
            .subscribe(response => {
                this.toastr.success("Reset code successfully sent on email");
            }, error => {// Handle any errors here
                this.toastr.error("Mail not found");
            });
    }

    confirmResetPassword(mail: string, code: string, password: string): void {
        const url = `${environment.apiUrl}authenticate/reset-password`;
        const params = { mail: mail, code: code, password: password };
        this.httpClient.post(url, null, { params, responseType: 'text' }).subscribe(response => {
            this.toastr.success(response);
            this.router.navigate(['login']);
        },error=>{
            this.toastr.warning("Account not found");
        });
    }

    signup(data: Register): Observable<any> {
        const url = `${environment.apiUrl}authenticate/register`;
        return this.httpClient.post(url, data);
    }

    logout(): void { //we remove tokens and clear localstorage
        localStorage.clear();
        this.closeConnection();
        this.username = "";
        this.isAuthenticated.next(false);
    }

    closeConnection() {
        this.coreSocketService.closeConnection();
    }

    confirm(mail: string, code: string) {
        const url = `${environment.apiUrl}authenticate/verify?${mail}&${code}`;
        const params = { mail: mail, code: code };
        return this.httpClient.post(url, null, { params, responseType: 'text' });
    }

    refresh_token(): Observable<any> {
        const url = `${environment.apiUrl}authenticate/refresh-token`;
        const currentHeaders = new HttpHeaders();
        const headers = currentHeaders
            .append('refresh-token', localStorage.getItem('refresh-token') || '');
        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
        // Make the HTTP POST request with the headers
        return this.httpClient.post<JwtToken>(url, null, { headers }).pipe(
            tap(responseData => {
                console.log('Poslali smo zahtjev za refrseh...');
                const access = responseData.token;
                const refresh = responseData['refresh-token'];
                console.log("Novi access token je ", access);
                console.log("Novi refresh token je ", refresh);
                if (access && refresh) { // Check if the tokens are not empty or undefined
                    localStorage.setItem('access-token', access);
                    localStorage.setItem('refresh-token', refresh);
                    console.log('setovali smo access i refresh...');
                    this.isAuthenticated.next(true);
                }
            })
        );
    }
}