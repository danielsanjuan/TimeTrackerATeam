import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule} from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {Ng2Webstorage} from 'ngx-webstorage';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ReactiveFormsModule } from '@angular/forms';

/*Provider*/
import { LoginProvider } from './providers/login.provider';
import { CheckInService } from './providers/check-in.service';
import { IncidenceService } from './providers/incidence.provider';
import { UserService } from './providers/user.provider';

/*Componentes*/
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CheckComponent } from './check/check.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import { IncidenceComponent } from './incidence/incidence.component';
import { PersonalIncidenceComponent } from './personal-incidence/personal-incidence.component';
import { UserlistComponent } from './userlist/userlist.component';
import { ModalUserComponent } from './modal-user/modal-user.component';
import { WeeklyReportComponent } from './weekly-report/weekly-report.component';
import { MonthlyReportComponent } from './monthly-report/monthly-report.component';
import { SetTimeCompanyComponent } from './set-time-company/set-time-company.component';

const appRoutes: Routes = [
  { path: 'personalIncidence/:email', component: PersonalIncidenceComponent },
  { path: 'incidence', component: IncidenceComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'userlist', component: UserlistComponent },
  { path: 'modaluser/:email', component: ModalUserComponent },
  { path: 'weeklyReport', component: WeeklyReportComponent },
  { path: 'monthlyReport', component: MonthlyReportComponent },
  { path: 'settings', component: SetTimeCompanyComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    CheckComponent,
    LoginComponent,
    HomeComponent,
    WeeklyReportComponent,
    LogoutComponent,
    UserlistComponent,
    IncidenceComponent,
    PersonalIncidenceComponent,
    ModalUserComponent,
    MonthlyReportComponent,
    SetTimeCompanyComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    Ng2Webstorage,
    NgbModule.forRoot(),
    RouterModule.forRoot(
      appRoutes
    ),
    ToastModule.forRoot(),
    BrowserAnimationsModule,
    NgxMyDatePickerModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    ReactiveFormsModule,
  ],
  providers: [
    CheckInService,
    LoginProvider,
    IncidenceService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
