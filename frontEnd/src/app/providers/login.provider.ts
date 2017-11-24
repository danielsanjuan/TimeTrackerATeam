import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Rx";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';

declare const gapi: any;

@Injectable()
export class LoginProvider {
    public auth2: any;
    public api: any =null;
    public localRoute = "http://localhost:8080/_ah/api";
    public serverRoute = "https://timetrackerateam.appspot.com/_ah/api"
    public currentUser:boolean = false;


    constructor(private http: HttpClient,
                private router:Router) {

    }

    public googleInit() {
      gapi.load('client:auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '678273591464-2donjmj0olnnsvmsp1308fd3ufl818dm.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.attachSignin(document.getElementById('googleBtn'));
      });
    }

    public callback() {
      console.log("gapi loaded");
    }

    public attachSignin(element) {
      gapi.client.load('timetracker', "v1",this.callback, this.localRoute)
      this.auth2.attachClickHandler(element, {},
        (googleUser) => {

          let profile = googleUser.getBasicProfile();
          console.log('Token || ' + googleUser.getAuthResponse().id_token);
          console.log('ID: ' + profile.getId());
          console.log('Name: ' + profile.getName());
          console.log('Image URL: ' + profile.getImageUrl());
          console.log('Email: ' + profile.getEmail());
          //YOUR CODE HERE
  	  this.doSomething(profile.getName());
        }, (error) => {
          // alert(JSON.stringify(error, undefined, 2));
        });
    }



    doSomething(Name) {
      gapi.client.timetracker.login({email:"TODO", password: "password", name: Name}).execute((response: any) => {
          if (response.error) {
            console.log(response.error);

          }
          else {
            console.log(JSON.stringify(response.result));
            this.currentUser = true;
            console.log(this.currentUser);
            this.router.navigate(['/home']);
            //window.location.reload();

          }
        }
      );
    }

    getCurrentUser(){
      return this.currentUser;
    }

}
