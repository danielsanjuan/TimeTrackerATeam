import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CheckInService } from './providers/check-in.service';

import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ng2-bs-dropdown';
import { CheckComponent } from './check/check.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AppComponent,
    CheckComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BsDropdownModule,
    HttpClientModule
  ],
  providers: [
    CheckInService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
