import { Component } from '@angular/core';
import { LoginProvider } from './providers/login.provider';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  navbar:boolean = true;
  
  constructor(private services:LoginProvider){}

}
