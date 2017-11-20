import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Rx";
import { HttpClient } from "@angular/common/http";

declare const gapi: any;

@Injectable()
export class LoginProvider {
    public auth2: any;
    public api: any =null;
    
  
  
    constructor(private http: HttpClient) {

    }

    
    public googleInit() {
      gapi.load('client:auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '31568523369-1b8gfocahpm809gu11saffdr3falla29.apps.googleusercontent.com',
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
  
  
      gapi.client.load('timeTracker', "v1",this.callback, "https://localhost:8080/_ah/api")
      this.auth2.attachClickHandler(element, {},
        (googleUser) => {
  
          let profile = googleUser.getBasicProfile();
          console.log('Token || ' + googleUser.getAuthResponse().id_token);
          console.log('ID: ' + profile.getId());
          console.log('Name: ' + profile.getName());
          console.log('Image URL: ' + profile.getImageUrl());
          console.log('Email: ' + profile.getEmail());
          //YOUR CODE HERE
  
  
        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  
    }
  
    
  
    doSomething() {
      gapi.client.timeTracker.login({email:"TODO", password: "password"}).execute((response: any) => {
          if (response.error) {
            console.log(response.error)
          }
          else {
            console.log(JSON.stringify(response.result));
          }
        }
      );
    }

}