import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Rx";
import { HttpClient } from "@angular/common/http";

declare const gapi: any;

@Injectable()
export class LoginProvider {
    public auth2: any;
    public api: any =null;
    currentUser:boolean = false;
    
  
  
    constructor(private http: HttpClient) {

    }

    
    public googleInit() {
      gapi.load('client:auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '1001374037432-ahu9hf73400ijjj3orjt7gi212n9m9vc.apps.googleusercontent.com',
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
  
  
      gapi.client.load('timeTracker', "v1",this.callback, "http://localhost:8080/_ah/api")
      this.auth2.attachClickHandler(element, {},
        (googleUser) => {
  
          let profile = googleUser.getBasicProfile();
          console.log('Token || ' + googleUser.getAuthResponse().id_token);
          console.log('ID: ' + profile.getId());
          console.log('Name: ' + profile.getName());
          console.log('Image URL: ' + profile.getImageUrl());
          console.log('Email: ' + profile.getEmail());
          //YOUR CODE HERE
  	  this.doSomething();
  
        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  
    }
  
    
  
    doSomething() {
      gapi.client.timeTracker.login({email:"TODO", password: "password"}).execute((response: any) => {
          if (response.error) {
            console.log(response.error);
            return this.currentUser = true;
            
          }
          else {
            console.log(JSON.stringify(response.result));
          }
        }
      );
    }

}
