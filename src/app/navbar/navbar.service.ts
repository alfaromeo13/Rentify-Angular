import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class NavbarService {
    usernameFrom : string='';
    newMessages: boolean = false;
}