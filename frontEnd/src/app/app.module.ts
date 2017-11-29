import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BsDropdownModule } from 'ng2-bs-dropdown';
import { ToastModule} from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {Ng2Webstorage} from 'ngx-webstorage';

/*Provider*/
import { LoginProvider } from './providers/login.provider';
import { CheckInService } from './providers/check-in.service';

/*Componentes*/
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CheckComponent } from './check/check.component';
import { HomeComponent } from './home/home.component';
import { ReportComponent } from './report/report.component';
import { LogoutComponent } from './logout/logout.component';


const appRoutes: Routes = [
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
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BsDropdownModule,
    HttpClientModule,
    Ng2Webstorage,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    ToastModule.forRoot(),
    BrowserAnimationsModule

  ],
  providers: [
    CheckInService,
    LoginProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
