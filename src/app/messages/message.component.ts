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
    openConversation(toUserId: number) { // toUserId je id korisnika sa kojim zelis da zapocnes konverzaciju

    }

    // slanje poruke korisniku
    sendMessage(toUserId: number, message: string) {

    }

    private getAllConversations() {
        this.messageService.getAllConversations().subscribe((data: any) => {
            
        });

    }

    
}