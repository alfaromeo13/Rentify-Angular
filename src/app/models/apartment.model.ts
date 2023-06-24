import { AddressDTO } from "./address.model";
import { ApartmentAttributeDTO } from "./apartmentAttribute.model";
import { ImageDTO } from "./image.model";
import { PeriodDTO } from "./period.model";
import { PropertyTypeDTO } from "./propertyType.model";
import { UserDTO } from "./user.model";

export class ApartmentDTO{
    id: number;
    title: string;
    price: number;
    description: string;
    sqMeters: number;
    numOfBedrooms: number;
    numOfBathrooms: number;
    createdAt: Date;
    number: string;
    isActive: boolean;
    user: UserDTO;
    period: PeriodDTO;
    address: AddressDTO;
    images: ImageDTO[];
    propertyType: PropertyTypeDTO;
    apartmentAttributes: ApartmentAttributeDTO[];
}