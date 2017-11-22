import { Component } from '@angular/core';
import { LoginProvider } from './providers/login.provider';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  navbar:boolean = false;
  
  constructor(private services:LoginProvider,
              private router: Router){

  }


}
