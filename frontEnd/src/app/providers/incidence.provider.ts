import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@Injectable()
export class IncidenceService {

  subject: Subject<any> = new Subject<any>();
  public localRoute = "http://localhost:8080/_ah/api/timetracker/v1/";
  public serverRoute = "https://timetrackerateam.appspot.com/_ah/api/timetracker/v1/";

  constructor(private http: HttpClient){

  }

  getIncidenceReport():Observable<any>{
    return this.http.get(this.serverRoute + 'incidencesUsersList');
  }

  getEmployee(email):Observable<any>{
    return this.http.get(this.serverRoute + 'getEmployee?email=' + email);
  }

  getPersonalIncidences(email):Observable<any>{
    return this.http.get(this.serverRoute + 'incidencesReport?email=' + email);
  }

  setIncidencesChecked(email):Observable<any>{
    let body = { "email": email};
    return this.http.post(this.serverRoute + 'setCheckIncidence', body);
  }

  solveIncidence(date):Observable<any>{
    let body = { "incidenceDate": date};
    return this.http.post(this.serverRoute + 'solveIncidence', body);
  }

  getCheckHoursIncidence(email, dateOriginal):Observable<any>{
    return this.http.get(this.serverRoute + 'getCheckHours?email=' + email + '&date=' + dateOriginal);
  }

  setCheckHoursIncidence(key, email, checkin, checkout):Observable<any>{
    let body = { "key": key, "email": email, "dateUpdatedCheckIn": checkin, "dateUpdatedCheckOut": checkout};
    return this.http.post(this.serverRoute + 'changeCheckHours', body);
  }
}
