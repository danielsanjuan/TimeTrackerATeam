import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CheckInService {

  constructor( private http: HttpClient) { }

  postCheckIn(){
    let body = {}
    this.http.post("http://localhost:8080/_ah/api/timetracker/v1/check_in", body).subscribe(
      (data)=>{
        console.log(data);
      });
  }
}
