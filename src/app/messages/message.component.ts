import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../auth/services/auth.service";
import { GlobalSocketService } from "../core/socket.service";
import { MessageDTO } from "../models/message.model";
import { RedisConversation } from "../models/redis-conversation.model";
import { NavbarService } from "../navbar/navbar.service";
import { MessageService } from "./message.service";

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit, OnDestroy {

    enteredText: string = ''
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop =
                this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    constructor(
        private toastr: ToastrService,
        public authService: AuthService,
        private navbarService: NavbarService,
        public messageService: MessageService,
        private socketService: GlobalSocketService,
    ) { }

    ngOnDestroy(): void {
        var hasUnoppened: boolean = false;
        for (const conversation of this.messageService.conversations) {
            if (!conversation.isOpened) hasUnoppened = true;
            if (conversation.id === this.messageService.selectedConversationId) {
                conversation.isClicked = false;
                break;
            }
        }
        this.navbarService.newMessages = hasUnoppened;
        this.messageService.insideMessages = false;
        this.messageService.selectedConversationId = '';
        this.messageService.currentMessages = [];
    }

    ngOnInit(): void {
        this.messageService.insideMessages = true;
        for (const conversation of this.messageService.conversations) {
            if (conversation.id === this.messageService.selectedConversationId) {
                conversation.isClicked = true;
                break;
            }
        }
        this.scrollToBottom();
    }

    previewMessagesForConversationWithId(conversation: RedisConversation) {
        this.messageService.selectedConversationId = conversation.id;
        conversation.showNotification = false;
        conversation.isOpened = true;

        for (const conversation of this.messageService.conversations)
            conversation.isClicked = false;

        conversation.isClicked = !conversation.isClicked;

        this.messageService.getMessagesFromConversationById(conversation.id)
            .subscribe((data: MessageDTO[]) => {
                this.messageService.currentMessages = data;
                for (const msg of this.messageService.currentMessages)
                    msg.localTime = moment(msg.timestamp).format('DD/MM/YYYY, h:mm:ss A');
                console.log(data);
            });
    }

    // slanje poruke korisniku
    sendMessage() {
        if (this.enteredText.trim().length !== 0 && this.messageService.selectedConversationId.length !== 0) {
            const destination = `/app/receive/${this.messageService.selectedConversationId}`;
            const payload = {
                timestamp: new Date(),
                message: this.enteredText,
                sender: this.authService.username,
            };
            // slanje poruke preko socket-a
            this.socketService.sendMessageToConversation(destination, payload);
            this.enteredText = '';
        } else this.toastr.info('Please select desired conversation first')
    }
}