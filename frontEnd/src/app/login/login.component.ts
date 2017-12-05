import { Component, OnInit } from '@angular/core';
import { LoginProvider } from '../providers/login.provider';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  manolo:any;

  constructor(private loginServer: LoginProvider) { }

  ngOnInit() {

  }

  ngAfterViewInit(){
    this.loginServer.googleInit();
  }
}
