import { Component, OnInit } from '@angular/core';
import { LoginProvider } from '../providers/login.provider';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  constructor(private loginServer: LoginProvider,
              private router:Router) { }

  ngOnInit() {
  }

  goToHome(){
    if(this.loginServer.doSomething()){
      this.router.navigate( ['/home'] )
      console.log("true");
    }else{
      console.log("false");
    }
  }

  ngAfterViewInit(){
    this.loginServer.googleInit();
  }
}
