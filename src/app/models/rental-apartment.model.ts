import { StatusDTO } from "./status.model";
import { UserDTO } from "./user.model";

export class RentalApartmentDTO {
    id: number;
    rentalPrice: number;
    status: StatusDTO;
    user: UserDTO;
    apartmentId: number;
    startDate: Date;
    endDate: Date;
}