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
import { UserGuard } from "./admin-users/user.guard";
import { RoomDetailsComponent } from "./room-details/room-details.component";
import { ConfirmAccountComponent } from "./confirm-account/confirm-account.component";
import { PrikazSlikeComponent } from "./prikaz-slike/prikaz-slike.component";
import { CityComponent } from "./city/city.component";
import { CreateApartmentComponent } from "./create-apartment/create-apartment.component";
import { AdminComponent } from "./admin/admin.component";
import { MessageComponent } from "./messages/message.component";
import { UserPanelComponent } from "./user-panel/user-panel.component";
import { AdminPropertiesComponent } from "./admin-properties/admin-properties.component";
import { BookingHistoryComponent } from "./booking-history/booking-history.component";
import { VisitedPlacesComponent } from "./visited-places/visited-places.component";

const routes: Routes = [
    {
        path: 'users', //http://localhost:4200/users
        component: UserComponent,
        canActivate: [UserGuard], //probaj sa isAuthenticated
    },
    // {
    //     path:'admin', //http://localhost:4200/admin
    //     component: AdminComponent,
    //     children:[
    //         {  //http://localhost:4200/admin/users
    //             path:'users',
    //             component: UserPreviewComponent
    //         }
    //     ]
    // },
    {
        path: 'login',
        component: LoginComponent,
        //canActivate:[IsAlreadyAuthenticatedGuard],
    },
    {
        path: 'properties',
        component: AdminPropertiesComponent,
    },
    {
        path: 'booking-history',
        component: BookingHistoryComponent,
    },
    {
        path: 'visited',
        component: VisitedPlacesComponent
    },
    {
        path: 'apartments',
        component: ApartmentComponent,
    },
    {
        path: 'test', //http://localhost:4200/test
        component: TestComponent,
    },
    {
        path: 'reset', //http://localhost:4200/reset
        component: ResetPassword,
    },
    {
        path: 'register', //http://localhost:4200/register
        component: RegisterComponent,
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'details',
        component: RoomDetailsComponent,
    },
    {
        path: 'user-panel',
        component: UserPanelComponent,
    },
    {
        path: 'confirm',
        component: ConfirmAccountComponent,
    },
    {
        path: 'showimg',
        component: PrikazSlikeComponent,
    },
    {
        path: 'showCities',
        component: CityComponent,
    },
    {
        path: 'messages',
        component: MessageComponent,
        canActivate: [isAuthenticated],
    },
    {
        path: 'add-property',
        component: CreateApartmentComponent,
    },
    {
        path: 'admin', //http://localhost:4200/admin
        component: AdminComponent,
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