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
import { ModalModule } from 'ngx-bootstrap';

/*Provider*/
import { LoginProvider } from './providers/login.provider';
import { CheckInService } from './providers/check-in.service';
import { IncidenceService } from './providers/incidence.provider';

/*Componentes*/
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CheckComponent } from './check/check.component';
import { HomeComponent } from './home/home.component';
import { ReportComponent } from './report/report.component';
import { LogoutComponent } from './logout/logout.component';
import { IncidenceComponent } from './incidence/incidence.component';
import { PersonalIncidenceComponent } from './personal-incidence/personal-incidence.component';

const appRoutes: Routes = [
  { path: 'personalIncidence/:email', component: PersonalIncidenceComponent },
  { path: 'incidence', component: IncidenceComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'report', component: ReportComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    CheckComponent,
    LoginComponent,
    HomeComponent,
    ReportComponent,
    LogoutComponent,
    IncidenceComponent,
    PersonalIncidenceComponent
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
    ModalModule.forRoot()
  ],
  providers: [
    CheckInService,
    LoginProvider,
    IncidenceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
