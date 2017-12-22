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
    return this.http.get(this.localRoute + 'incidencesUsersList');
  }

  getEmployee(email):Observable<any>{
    return this.http.get(this.localRoute + 'getEmployee?email=' + email);
  }

  getPersonalIncidences(email):Observable<any>{
    return this.http.get(this.localRoute + 'incidencesReport?email=' + email);
  }

  setIncidencesChecked(email):Observable<any>{
    let body = { "email": email};
    return this.http.post(this.localRoute + 'setCheckIncidence', body);
  }

  solveIncidence(date):Observable<any>{
    console.log("Fecha por aqui" + date);
    let body = { "incidenceDate": date};
    return this.http.post(this.localRoute + 'solveIncidence', body);
  }
}
