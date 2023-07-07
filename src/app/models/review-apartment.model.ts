export class ReviewApartmentDTO {
    grade: number;
    comment: string;
    apartmentId: number;

    constructor(grade: number, comment: string, apartmentId: number) {
        this.grade = grade;
        this.comment = comment;
        this.apartmentId = apartmentId;
    }
}