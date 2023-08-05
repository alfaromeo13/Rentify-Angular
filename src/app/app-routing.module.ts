import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IsAlreadyAuthenticatedGuard } from "./auth/guards/is-already-authenticated.guard";
import { isAuthenticated } from "./auth/guards/is-authenticated.guard";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { ApartmentComponent } from './apartment/apartment.component';
import { ResetPassword } from "./password-reset/reset-password.component";
import { RegisterComponent } from "./register/register.component";
import { TestComponent } from "./testna-komponenta/test.component";
import { UserComponent } from "./admin-users/user.component";
import { RoomDetailsComponent } from "./room-details/room-details.component";
import { ConfirmAccountComponent } from "./confirm-account/confirm-account.component";
import { CreateApartmentComponent } from "./create-apartment/create-apartment.component";
import { AdminComponent } from "./admin/admin.component";
import { MessageComponent } from "./messages/message.component";
import { UserPanelComponent } from "./user-panel/user-panel.component";
import { AdminPropertiesComponent } from "./admin-properties/admin-properties.component";
import { BookingHistoryComponent } from "./booking-history/booking-history.component";
import { VisitedPlacesComponent } from "./visited-places/visited-places.component";
import { MyPropertiesComponent } from "./my-properties/my-properties.component";
import { UpdateApartmentComponent } from "./update-apartment/update-apartment.component";
import { IsAdminGuard } from "./auth/guards/is-admin.guard";
import { IsAdminPropertyGuard } from "./auth/guards/is-admin-property.guard";
import { IsNotAdminGuard } from "./auth/guards/is-not-admin.guard";
import { IsUpdateable } from "./auth/guards/is-update.guard";
import { IsPreviewGuard } from "./auth/guards/is-preview.guard";
import { ApartmentSearchGuard } from "./auth/guards/apartment-search.guard";

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'register', //http://localhost:4200/register
        component: RegisterComponent,
    },
    {
        path: 'reset', //http://localhost:4200/reset
        component: ResetPassword,
    },
    {
        path: 'confirm',
        component: ConfirmAccountComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [IsAlreadyAuthenticatedGuard],
    },
    {
        path: 'properties',
        component: AdminPropertiesComponent,
        canActivate: [IsAdminPropertyGuard],
    },
    {
        path: 'users', //http://localhost:4200/users
        component: UserComponent,
        canActivate: [IsAdminGuard],
    },
    {
        path: 'admin', //http://localhost:4200/admin
        component: AdminComponent,
        canActivate: [IsAdminGuard],
    },
    {
        path: 'user-panel',
        component: UserPanelComponent,
        canActivate: [IsNotAdminGuard, isAuthenticated],
    },
    {
        path: 'booking-history',
        component: BookingHistoryComponent,
        canActivate: [IsNotAdminGuard, isAuthenticated],
    },
    {
        path: 'visited',
        component: VisitedPlacesComponent,
        canActivate: [IsNotAdminGuard, isAuthenticated]
    },
    {
        path: 'my-properties',
        component: MyPropertiesComponent,
        canActivate: [IsNotAdminGuard, isAuthenticated],
    },
    {
        path: 'messages',
        component: MessageComponent,
        canActivate: [isAuthenticated],
    },
    {
        path: 'add-property',
        component: CreateApartmentComponent,
        canActivate: [isAuthenticated],
    },
    {
        path: 'apartments',
        component: ApartmentComponent,
        canActivate: [ApartmentSearchGuard],
    },
    {
        path: 'update-property',
        component: UpdateApartmentComponent,
        canActivate: [isAuthenticated, IsUpdateable],
    },
    {
        path: 'details',
        component: RoomDetailsComponent,
        canActivate: [IsPreviewGuard],
    },
    {
        path: 'test', //http://localhost:4200/test
        component: TestComponent,
        canActivate: [IsAdminGuard],
    },
    {   //if anything else is entered ex: http://localhost:4200/something...
        path: '**', //we redirect request to home component
        redirectTo: 'home'
    }]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { } 