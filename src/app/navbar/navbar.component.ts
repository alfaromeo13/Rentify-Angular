import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { NavbarLink } from './navbar.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls:['navbar.component.css'],
})
export class NavbarComponent implements OnInit{
    
    isMobileNavActive :boolean = false;
    isUserAuthenticated :boolean = false;

    //we load navbar elements dynamicaly with ngFor
    links :NavbarLink[]=[
        {
            name: "Test",
            path: "/test"
        },
        {
            name: "Messages",
            path: "/messages"
        },
        {
            name: "Users",
            path: "/users"
        },
        {
            name: "Apartments",
            path: "/apartments"
        },
        {
            name: "Favourites",
            path: "/favourites"
        },
    ];

    constructor(
        private router :Router,
        private authService :AuthService
    ){}

    //prilikom inicijalizacije navbar komponente 
    //subscribujemo se na behavioursubject
    ngOnInit(): void {
        this.authService.isAuthenticated.subscribe(data => {
            this.isUserAuthenticated = data;
        });
    }

    toggleMobileView(): void {
        this.isMobileNavActive=!this.isMobileNavActive;
    }

    logout(): void{
        this.authService.logout();
        this.router.navigate(['login'])
    }
}