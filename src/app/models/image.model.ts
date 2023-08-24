import { SafeResourceUrl } from "@angular/platform-browser";

export class ImageDTO {
    public id: number;
    public path: string;
    public display?: SafeResourceUrl;

    constructor(display: SafeResourceUrl) {
        this.display = display;
    }
}