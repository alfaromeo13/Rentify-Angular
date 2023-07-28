import { MessageDTO } from "./message.model";

export class RedisConversation {
    id: string;
    usernameFrom: string;
    usernameTo: string;
    createdAt: Date;
    isOpened: boolean;
    messages: MessageDTO[] = [];

    localTime?: string;
    isClicked?: boolean = false;
    showNotification?: boolean = false;
}