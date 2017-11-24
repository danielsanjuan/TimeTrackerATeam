import { Component } from '@angular/core';
import { LoginProvider } from './providers/login.provider';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  navbar:boolean = true;
  numberIncidences: number = 0;
  
  constructor(private services:LoginProvider){}
  

}
