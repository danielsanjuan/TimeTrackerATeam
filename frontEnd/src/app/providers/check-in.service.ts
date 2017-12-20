import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@Injectable()
export class CheckInService {
  timeIn:string;
  subject: Subject<any> = new Subject<any>();
  public localRoute = "http://localhost:8080/_ah/api";
  public serverRoute = "https://timetrackerateam.appspot.com/_ah/api";

  constructor( private http: HttpClient, private sessionSt:SessionStorageService) { }

  postCheckIn():Observable<any>{
    let body = {"email": this.sessionSt.retrieve('email')}
    return this.http.post(this.localRoute + "/timetracker/v1/check_in", body);
  }

  postCheckOut():Observable<any>{
    let body = {"email": this.sessionSt.retrieve('email')}
    return this.http.post(this.localRoute + "/timetracker/v1/check_out", body);
  }

  getCheckIn():Observable<any>{
    return this.http.get(this.localRoute + "/timetracker/v1/getCheckin?email=" + this.sessionSt.retrieve('email'));
  }

  getCheckout():Observable<any>{
    return this.http.get(this.localRoute + "/timetracker/v1/getCheckout?email=" + this.sessionSt.retrieve('email'));
  }

  getWeeklyReport(): Observable<any>{
    return this.http.get<any>(this.localRoute + "/timetracker/v1/weeklyReport");
  }
  
  getWeeklyReportWithDate(date):Observable<any>{
    return this.http.get<any>(this.localRoute + "/timetracker/v1/weeklyReportWithDate?week=" + date);
  }

  getDateNow(): Observable<any>{
    return this.http.get<any>(this.localRoute + "/timetracker/v1/getDateNow");
  }

  getMontlyReport(): Observable<any>{
    return this.http.get<any>(this.localRoute + "/timetracker/v1/monthlyReport");
  }

  checkWorkedDay(): Observable<any>{
    return this.http.get<any>(this.localRoute + "/timetracker/v1/checkWorkedDay?email=" + this.sessionSt.retrieve('email'));
  }

}
