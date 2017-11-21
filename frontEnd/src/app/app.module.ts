import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { CheckInService } from './providers/check-in.service';
import { LoginProvider } from './providers/login.provider';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ng2-bs-dropdown';
import { CheckComponent } from './check/check.component';


@NgModule({
  declarations: [
    AppComponent,
    CheckComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BsDropdownModule,
    HttpClientModule
  ],
  providers: [
    CheckInService,
    LoginProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
