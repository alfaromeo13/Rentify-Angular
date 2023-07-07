import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApartmentService } from '../apartment/apartment.service';
import { AuthService } from '../auth/services/auth.service';
import { FilterService } from '../filter/filter.service';
import { NavbarLink } from './navbar.model';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['navbar.component.css'],
})
export class NavbarComponent implements OnInit {

    isMobileNavActive: boolean = false;
    isUserAuthenticated: boolean = false;

    //we load navbar elements dynamicaly with ngFor
    links: NavbarLink[] = [
        {
            name: "Test",
            path: "/test"
        },
        {
            name: "Users",
            path: "/users"
        }
    ];

    constructor(
        private router: Router,
        public authService: AuthService,
        private apartmentService: ApartmentService,
    ) { }


    ngOnInit(): void {
        this.authService.isAuthenticated.subscribe(data => {
            this.isUserAuthenticated = data;
        });
    }

    toggleMobileView(): void {
        this.isMobileNavActive = !this.isMobileNavActive;
    }

    showLiked():void{
        this.apartmentService.filterService.pageNo=1;
        this.apartmentService.allFavorite();
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['login'])
    }
}