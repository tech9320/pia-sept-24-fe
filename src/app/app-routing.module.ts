import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ProfileComponent } from './profile/profile.component';
import { CompaniesComponent } from './companies/companies.component';
import { EntitiesComponent } from './entities/entities.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { RequestsComponent } from './requests/requests.component';
import { AdminDecoratorsComponent } from './admin-decorators/admin-decorators.component';
import { CompaniesDetailsComponent } from './companies-details/companies-details.component';
import { MakeRequestComponent } from './make-request/make-request.component';
import { AllRequestsComponent } from './all-requests/all-requests.component';
import { WorkerRequestsComponent } from './worker-requests/worker-requests.component';
import { MaintenancesComponent } from './maintenances/maintenances.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'password-change', component: PasswordChangeComponent },
  { path: 'admin', component: AdminLoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'companies/details', component: CompaniesDetailsComponent },
  { path: 'companies/details/make-request', component: MakeRequestComponent },
  { path: 'requests', component: AllRequestsComponent },
  { path: 'maintanences', component: MaintenancesComponent },
  { path: 'admin/entities', component: EntitiesComponent },
  { path: 'admin/update-user', component: UpdateUserComponent },
  { path: 'admin/decorator', component: AdminDecoratorsComponent },
  { path: 'admin/request', component: RequestsComponent },
  { path: 'worker/requests', component: WorkerRequestsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
