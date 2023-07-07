import { Component, OnInit } from "@angular/core";
import { GlobalSocketService } from "../core/socket.service";
import { MessageService } from "./message.service";

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html'
})
export class MessageComponent implements OnInit {

    conversations: any[] = []; // lista konverzacija

    constructor(
        private socketService: GlobalSocketService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        
    }

    // pozivas klikom na odredjeno dugme (nova konverzacija ili postojeca konverzacija)
    openNewConversation(toUsername: string) { // toUsername je username korisnika sa kojim zelis da zapocnes konverzaciju
        const data = {"usernameFrom": "", "usernameTo": toUsername};
        // usernameFrom => username trenutno ulogovanog korisnika (izvuci iz locale storage-a)
        // npr: const username = localStorage.getItem("username");

        // usernameTo => sa kojim user-om zelis da ostvaris konverzaciju


        this.messageService.createNewConversation(data).subscribe((data: any) => {
            console.log(data);
            // subscribe na topic => /topic/conversation/{conversationId}
            // {conversationId} je id konverzacije koji dobijas u data objektu
            // pristupas mu sa data.conversationId (String)
            // subscribe-ujes se preko socketService-a
        });
    }

    previewMessagesFromConversation(conversationId: string) {
        this.messageService.getMessagesFromConversationById(conversationId).subscribe((data: any) => {
            console.log(data);
        });
    }

    previewAllConversationsForCurrentUser() {
        const username = ""; 
        // username trenutno ulogovanog korisnika (izvuci iz locale storage-a)
        // npr: const username = localStorage.getItem("username");

        this.messageService.getAllConversationsByUser(username).subscribe((data: any) => {
            console.log(data);
        });
    }

    // slanje poruke korisniku
    sendMessage(conversationId: string, message: string) {
        const currentUsername = ""; // username ulogovanog korisnika

        const destination = `/app/receive/${conversationId}`;
        const payload = {
            message: message,
            sender: currentUsername,
            timestamp: new Date()
        };

        // slanje poruke preko socket-a
        this.socketService.sendMessageToConversation(destination, payload);
    }

    subscribeToConversation(conversationId: string) {
        const topic = `/topic/conversation/${conversationId}`;
        this.socketService.subscribeToConversation(topic, (data: any) => {
            console.log(data);
            // data je poruka koju si primio preko socket-a (poslata od strane drugog korisnika)
        });
    }
}