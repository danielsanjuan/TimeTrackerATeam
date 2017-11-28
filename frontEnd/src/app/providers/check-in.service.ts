import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@Injectable()
export class CheckInService {

  constructor( private http: HttpClient, private sessionSt:SessionStorageService) { }

  postCheckIn(){
    console.log(this.sessionSt.retrieve('email'))
    let body = {"email": this.sessionSt.retrieve('email')}
    this.http.post("https://timetrackerateam.appspot.com/_ah/api/timetracker/v1/check_out", body).subscribe(
      (data)=>{
        console.log(data);
      });
  }

  getCheckIn(){

  }
}
