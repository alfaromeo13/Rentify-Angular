import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ApartmentComponent } from './apartment/apartment.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor } from './auth/interceptors/error.interceptor';
import { JwtInterceptor } from './auth/interceptors/jwt.interceptor';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ResetPassword } from './password-reset/reset-password.component';
import { RegisterComponent } from './register/register.component';
import { TestComponent } from './testna-komponenta/test.component';
import { UserComponent } from './admin-users/user.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RoomComponent } from './room/room.component';
import { PrikazSlikeComponent } from './prikaz-slike/prikaz-slike.component';
import { RoomDetailsComponent } from './room-details/room-details.component';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';
import { CityComponent } from './city/city.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FilterComponent } from './filter/filter.component';
import { CreateApartmentComponent } from './create-apartment/create-apartment.component';
// import { WINDOW_PROVIDERS } from '@app/core/providers/window.provider';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './messages/message.component';

import { AdminComponent } from './admin/admin.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { AdminPropertiesComponent } from './admin-properties/admin-properties.component';
import { ImageWithButtonComponent } from './image-with-button/image-with-button.component';
import { ReportComponent } from './report/report.component';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { VisitedPlacesComponent } from './visited-places/visited-places.component';
import { MyPropertiesComponent } from './my-properties/my-properties.component';
import { UpdateApartmentComponent } from './update-apartment/update-apartment.component';
import { ResetPasswordNextComponent } from './reset-password-next/reset-password-next.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    TestComponent,
    UserComponent,
    RegisterComponent,
    LoginComponent,
    ResetPassword,
    ApartmentComponent,
    RoomComponent,
    PrikazSlikeComponent,
    CityComponent,
    RoomDetailsComponent,
    ConfirmAccountComponent,
    FilterComponent,
    CreateApartmentComponent,
    MessageComponent,
    AdminComponent,
    UserPanelComponent,
    AdminPropertiesComponent,
    ImageWithButtonComponent,
    ReportComponent,
    BookingHistoryComponent,
    VisitedPlacesComponent,
    MyPropertiesComponent,
    UpdateApartmentComponent,
    ResetPasswordNextComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      preventDuplicates: true,
      timeOut: 2700,
      enableHtml: true,
    }), FontAwesomeModule, // ToastrModule
  ],
  providers:
    [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
