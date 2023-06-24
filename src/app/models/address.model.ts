import { NeighborhoodDTO } from "./neighbourhood.model";

export class AddressDTO {
    public x: number;
    public y: number;
    public street: string;
    public neighborhood: NeighborhoodDTO;
}