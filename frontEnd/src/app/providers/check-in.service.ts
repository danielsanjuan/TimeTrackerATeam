import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@Injectable()
export class CheckInService {
  timeIn:string;
  subject: Subject<any> = new Subject<any>();

  constructor( private http: HttpClient, private sessionSt:SessionStorageService) { }

  postCheckIn():Observable<any>{
    console.log(this.sessionSt.retrieve('email'))
    let body = {"email": this.sessionSt.retrieve('email')}
    return this.http.post("https://timetrackerateam.appspot.com/_ah/api/timetracker/v1/check_in", body);
  }

  postCheckOut():Observable<any>{
    let body = {"email": this.sessionSt.retrieve('email')}
    return this.http.post("https://timetrackerateam.appspot.com/_ah/api/timetracker/v1/check_out", body);
  }

  getCheckIn():Observable<any>{
    return this.http.get("https://timetrackerateam.appspot.com/_ah/api/timetracker/v1/getCheckin");
  }


  getWeeklyReport(): Observable<any>{
    return this.http.get<any>("https://timetrackerateam.appspot.com/_ah/api/timetracker/v1/weeklyReport");
  }

  getDateNow(): Observable<any>{
    return this.http.get<any>("https://timetrackerateam.appspot.com/_ah/api/timetracker/v1/getDateNow");
  }

  getMontlyReport(): Observable<any>{
    return this.http.get<any>("https://timetrackerateam.appspot.com/_ah/api/timetracker/v1/monthlyReport");    
  }

}
