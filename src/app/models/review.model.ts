import { UserDTO } from "./user.model";

export class ReviewDTO {
    id: number;
    grade: number;
    comment: string;
    createdAt: Date;
    isActive: boolean;
    user: UserDTO;
    localTime: string;
}