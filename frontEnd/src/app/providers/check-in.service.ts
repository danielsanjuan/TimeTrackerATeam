import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@Injectable()
export class CheckInService {
  timeIn:string;
  subject: Subject<any> = new Subject<any>();
  public localRoute = "http://localhost:8080/_ah/api/timetracker/v1/";
  public serverRoute = "https://timetrackerateam.appspot.com/_ah/api/timetracker/v1/";

  constructor( private http: HttpClient, private sessionSt:SessionStorageService) { }

  postCheckIn():Observable<any>{
    let body = {"email": this.sessionSt.retrieve('email')}
    return this.http.post(this.localRoute + "check_in", body);
  }

  postCheckOut():Observable<any>{
    let body = {"email": this.sessionSt.retrieve('email')}
    return this.http.post(this.localRoute + "check_out", body);
  }

  getCheckIn():Observable<any>{
    return this.http.get(this.localRoute + "getCheckin?email=" + this.sessionSt.retrieve('email'));
  }

  getCheckout():Observable<any>{
    return this.http.get(this.localRoute + "getCheckout?email=" + this.sessionSt.retrieve('email'));
  }

  getLastCheckIn():Observable<any>{
    return this.http.get(this.localRoute + "getLastCheckIn?email=" + this.sessionSt.retrieve('email'));
  }

  getWeeklyReport(): Observable<any>{
    return this.http.get<any>(this.localRoute + "weeklyReport");
  }

  getWeeklyReportWithDate(date):Observable<any>{
    return this.http.get<any>(this.localRoute + "weeklyReportWithDate?week=" + date);
  }

  getWorkedHoursToday(): Observable<any>{
    return this.http.get<any>(this.localRoute + "getWorkedHoursToday?email=" + this.sessionSt.retrieve('email'));
  }

  getDateNow(): Observable<any>{
    return this.http.get<any>(this.localRoute + "getDateNow");
  }

  getMontlyReport(): Observable<any>{
    return this.http.get<any>(this.localRoute + "monthlyReport");
  }

  getMonthlyReportWithDate(date):Observable<any>{
    return this.http.get<any>(this.localRoute + "monthlyReportDate?monthDate=" + date);
  }

  checkWorkedDay(): Observable<any>{
    return this.http.get<any>(this.localRoute + "checkWorkedDay?email=" + this.sessionSt.retrieve('email'));
  }

  getCompanyTimes(): Observable<any>{
    return this.http.get(this.localRoute + "getCompanyTimes");
  }

  postCompanyTimes(times):Observable<any>{
    let body = times;
    return this.http.post(this.localRoute + "setCompanyTimes", body);
  }
  

}
