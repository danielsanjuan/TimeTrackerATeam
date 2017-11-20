import { Component, OnInit } from '@angular/core';
import { LoginProvider } from '../providers/login.provider';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  constructor(private loginServer: LoginProvider) { }

  ngOnInit() {
  }

  gapi(){
    this.loginServer.doSomething();
  }

  ngAfterViewInit(){
    this.loginServer.googleInit();
  }
}
