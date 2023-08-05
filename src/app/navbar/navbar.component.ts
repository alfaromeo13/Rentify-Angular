import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApartmentService } from '../apartment/apartment.service';
import { AuthService } from '../auth/services/auth.service';
import { MessageService } from '../messages/message.service';
import { NotificationService } from '../services/notification.service';
import { NavbarService } from './navbar.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {

    isMobileNavActive: boolean = false;
    isUserAuthenticated: boolean = false;

    constructor(
        private router: Router,
        private notificationService: NotificationService,
        public messageService: MessageService,
        public authService: AuthService,
        public navbarService: NavbarService,
        private apartmentService: ApartmentService,
    ) { }

    ngOnInit(): void {
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('access-token');
        if (token && username) {
            this.isUserAuthenticated = true;
            this.authService.isAuthenticated.next(true);
            this.authService.username = username;
        }

        this.authService.isAuthenticated.subscribe(data => {
            this.isUserAuthenticated = data;
        });

        if (this.isUserAuthenticated) {
            this.authService.openWS();
        }
    }

    ngOnDestroy(): void {
        this.authService.closeConnection();
    }

    toggleMobileView(): void {
        this.isMobileNavActive = !this.isMobileNavActive;
    }

    showReportModal(): void {
        this.notificationService.isActive = true;
    }

    showLiked(): void {
        this.apartmentService.filterService.pageNo = 1;
        this.apartmentService.apartmani = [];
        this.apartmentService.apartmentList = [];
        localStorage.setItem('liked', 'true');
        this.apartmentService.allFavorite();
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['login']);
    }
}