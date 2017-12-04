import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@Injectable()
export class IncidenceService {

  subject: Subject<any> = new Subject<any>();
  public localRoute = "http://localhost:8080/_ah/api";
  public serverRoute = "https://timetrackerateam.appspot.com/_ah/api/timetracker/v1/";

  constructor(private http: HttpClient){

  }

  getIncidenceReport():Observable<any>{
    return this.http.get(this.serverRoute + 'usersList');
  }


}
