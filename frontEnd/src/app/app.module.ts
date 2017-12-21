import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BsDropdownModule } from 'ng2-bs-dropdown';
import { ToastModule} from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {Ng2Webstorage} from 'ngx-webstorage';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/*Provider*/
import { LoginProvider } from './providers/login.provider';
import { CheckInService } from './providers/check-in.service';
import { IncidenceService } from './providers/incidence.provider';
import { ProtectingRoutesGuard } from './protectingRoutes.guard';

/*Componentes*/
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CheckComponent } from './check/check.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import { IncidenceComponent } from './incidence/incidence.component';
import { PersonalIncidenceComponent } from './personal-incidence/personal-incidence.component';
import { WeeklyReportComponent } from './weekly-report/weekly-report.component';
import { MonthlyReportComponent } from './monthly-report/monthly-report.component';

const appRoutes: Routes = [
  { path: 'personalIncidence/:email', component: PersonalIncidenceComponent },
  { path: 'incidence', component: IncidenceComponent, canActivate: [ProtectingRoutesGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'weeklyReport', component: WeeklyReportComponent, canActivate: [ProtectingRoutesGuard] },
  { path: 'monthlyReport', component: MonthlyReportComponent, canActivate: [ProtectingRoutesGuard] },
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
    IncidenceComponent,
    PersonalIncidenceComponent,
    MonthlyReportComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BsDropdownModule,
    HttpClientModule,
    Ng2Webstorage,
    NgbModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    ToastModule.forRoot(),
    BrowserAnimationsModule,
    NgxMyDatePickerModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [
    CheckInService,
    LoginProvider,
    IncidenceService,
    ProtectingRoutesGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
