import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CheckInService {
  timeIn:string;
  subject: Subject<any> = new Subject<any>();

  constructor( private http: HttpClient) { }

  postCheckIn():Observable<any>{
    let body = {}
    return this.http.post("https://timetrackerateam.appspot.com/_ah/api/timetracker/v1/check_in", body);
  }

  getCheckIn():Observable<any>{
    return this.http.get("https://timetrackerateam.appspot.com/_ah/api/timetracker/v1/getCheckin");
  }

}
