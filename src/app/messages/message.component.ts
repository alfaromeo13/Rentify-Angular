import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Emoji } from "@ctrl/ngx-emoji-mart/ngx-emoji";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../auth/services/auth.service";
import { GlobalSocketService } from "../core/socket.service";
import { MessageDTO } from "../models/message.model";
import { RedisConversation } from "../models/redis-conversation.model";
import { NavbarService } from "../navbar/navbar.service";
import { NotificationService } from "../services/notification.service";
import { MessageService } from "./message.service";
import { LinkifyPipe } from '../linkify.pipe'; // Adjust the path accordingly

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css'],
    providers: [LinkifyPipe],
})
export class MessageComponent implements OnInit, OnDestroy {

    selectedFiles: File[] = []; // Array to store selected files
    enteredText: string = '';
    recentEmojis: string[] = [];
    isEmojiOpen: boolean = false;
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

    toggleEmojiPicker() {
        this.isEmojiOpen = !this.isEmojiOpen;
    }

    // onEmojiClick(selected: Emoji) {
    //     const emoji: string = (selected.emoji as any).native;
    //     this.enteredText += emoji; // Add emoji to the input text
    //     this.isEmojiOpen = false;
    // }

    onEmojiClick(event: { emoji: { native: any; }; }) {
        this.enteredText = `${this.enteredText}${event.emoji.native}`;
        this.isEmojiOpen = false;
    }

    onFileSelected(event: any) {
        this.selectedFiles = event.target.files;
        if (this.messageService.selectedConversationId.length !== 0) {
            this.messageService.sendImages(this.selectedFiles)
                .subscribe(
                    () => {
                        console.log('Images sent successfully');
                        // Handle success, such as showing a success message
                    },
                    error => {
                        console.error('Error sending images:', error);
                        // Handle error, such as showing an error message
                    }
                );

        } else this.toastr.info('Please select desired conversation first')
        this.selectedFiles = [];
    }

    constructor(
        private toastr: ToastrService,
        public authService: AuthService,
        private navbarService: NavbarService,
        public messageService: MessageService,
        private socketService: GlobalSocketService,
        public notificationService: NotificationService,
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
                console.log(data);
                for (const msg of this.messageService.currentMessages)
                    msg.localTime = moment(msg.timestamp).format('DD/MM/YYYY, h:mm:ss A');
                console.log(data);
            });
    }

    handleClick(event: Event) {
        const target = event.target as HTMLElement;
        if (target.tagName === 'IMG') {
            const imageUrl = target.getAttribute('data-image');
            if (imageUrl) {
                window.open(imageUrl, '_blank');
            }
        }
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