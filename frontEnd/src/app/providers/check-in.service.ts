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
    return this.http.post(this.serverRoute + "check_in", body);
  }

  postCheckOut():Observable<any>{
    let body = {"email": this.sessionSt.retrieve('email')}
    return this.http.post(this.serverRoute + "check_out", body);
  }

  getCheckIn():Observable<any>{
    return this.http.get(this.serverRoute + "getCheckin?email=" + this.sessionSt.retrieve('email'));
  }

  getCheckout():Observable<any>{
    return this.http.get(this.serverRoute + "getCheckout?email=" + this.sessionSt.retrieve('email'));
  }

  getWeeklyReport(): Observable<any>{
    return this.http.get<any>(this.serverRoute + "weeklyReport");
  }

  getWeeklyReportWithDate(date):Observable<any>{
    return this.http.get<any>(this.serverRoute + "weeklyReportWithDate?week=" + date);
  }

  getDateNow(): Observable<any>{
    return this.http.get<any>(this.serverRoute + "getDateNow");
  }

  getMontlyReport(): Observable<any>{
    return this.http.get<any>(this.serverRoute + "monthlyReport");
  }

  getMonthlyReportWithDate(date):Observable<any>{
    return this.http.get<any>(this.serverRoute + "monthlyReportDate?monthDate=" + date);
  }

  checkWorkedDay(): Observable<any>{
    return this.http.get<any>(this.serverRoute + "checkWorkedDay?email=" + this.sessionSt.retrieve('email'));
  }

  getCompanyTimes(): Observable<any>{
    return this.http.get(this.serverRoute + "getCompanyTimes");
  }

  postCompanyTimes(times):Observable<any>{
    let body = times;
    return this.http.post(this.serverRoute + "setCompanyTimes", body);
  }

}
