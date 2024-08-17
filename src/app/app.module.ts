import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ProfileComponent } from './profile/profile.component';
import { CompaniesComponent } from './companies/companies.component';
import { EntitiesComponent } from './entities/entities.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { RequestsComponent } from './requests/requests.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    PasswordChangeComponent,
    AdminLoginComponent,
    ProfileComponent,
    CompaniesComponent,
    EntitiesComponent,
    UpdateUserComponent,
    RequestsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      progressBar: true,
      preventDuplicates: true,
    }),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
