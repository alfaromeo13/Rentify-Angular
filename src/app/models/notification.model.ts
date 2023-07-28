export class NotificationDTO {
    public id?: number;
    public message: string;
    public createdAt?: Date;
    public senderUsername?: string;
    public receiverUsername: string;
}