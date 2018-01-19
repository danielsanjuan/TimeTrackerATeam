import { Component, OnInit, ViewContainerRef } from '@angular/core';
import * as moment from 'moment';
import { NgClass } from '@angular/common';
import { CheckInService } from '../providers/check-in.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {
  checkOutTime: string = "" ;
  doCheckIn:boolean = true;
  doCheckOut:boolean = false;
  E202:boolean=false;
  E406:boolean=false;
  E500:boolean=false;
  timer:any;
  checkInTime:string;
  hoursWorked:number = 0;
  week:number = 0;
  hours_today:string = "00:00";
  hours_week:string = "00:00";
  emailUser:string = "";
  fechaNow:any;
  fechaCheckIn:any;
  fechaCheckout:any;
  interval:any;
  timeCheckout:boolean;
  readyCheckOut:boolean = false;
  IP:string = "";
  hoursMock:string = '09:00';

  constructor( private services:CheckInService,
               private sessionSt: SessionStorageService,
               private router: Router,
               public toastr: ToastsManager, vcr: ViewContainerRef,
               private localSt: LocalStorageService,
               private _http: HttpClient) {
                 this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    var ip = window.location.origin;
    this.emailUser = this.sessionSt.retrieve('email');
    this.services.checkWorkedDay().subscribe((data) => {
      if (data.response_date == "No has hecho checkin"){
        this.doCheckIn = true;
        this.doCheckOut = false;
      }else if (data.response_date == "No has hecho checkout"){
        this.doCheckIn = false;
        this.doCheckOut = true;
      }else{
        this.doCheckIn = true;
        this.doCheckOut = false;
      }
      this.services.getWorkedHoursByWeek().subscribe((data)=>{
        this.week=parseInt(data.response_date);
        this.hours_week = this.formatHour(this.week);
      });
      this.services.getWorkedHoursToday().subscribe((data)=>{
        this.hoursWorked=parseInt(data.response_date);

        this.hours_today = this.formatHour(this.hoursWorked);
        if (this.doCheckOut)
        this.startTiming();
      });
    });

  }

  startTiming(){
      this.timer = setInterval(() => {
        this.playTimer(this.doCheckOut)
    },59000);
  }

  playTimer(boleano){
    if (boleano){
      this.hoursWorked= this.hoursWorked +60000;
      this.week= this.week +60000;
      this.hours_today = this.formatHour(this.hoursWorked);
      this.hours_week = this.formatHour(this.week);
    }
  }

  formatHour(timer){
    let date = new Date(parseInt(timer));
    let day = date.getDate();
    let hour = date.getHours() + (day-1) * 24;
    let hourSt = (hour<=9)?"0"+hour:hour;
    let minute = (date.getMinutes()<=9)?"0"+date.getMinutes():date.getMinutes();
    return hourSt+":"+minute;
  }

  timeCheckIn(){
    this.alertTimeNear();
    this.getIp();
    this.doCheckIn = false;
    this.doCheckOut = true;
    setTimeout(() => {
      this.services.postCheckIn(this.IP).subscribe( (data)=>{
        switch(data.response_code){
          case "200":
          this.checkInTime = data.response_date;
              let timeOk = this.checkInTime[7]+""+this.checkInTime[8]+":"+this.checkInTime[10]+""+this.checkInTime[11];
              this.toastr.success('You have made check-in at  '+timeOk, 'Success!');
              this.timeCheckout = false;
              setTimeout(() => {
                this.startTiming();
              }, 100);
              break;
          case "202":
          this.checkInTime = data.response_date;
              let timeLate = this.checkInTime[7]+""+this.checkInTime[8]+":"+this.checkInTime[10]+""+this.checkInTime[11];
              this.toastr.warning('You are too late '+ timeLate, 'Alert!');
              this.timeCheckout = false;
              setTimeout(() => {
                this.startTiming();
              }, 100);
              this.E202=true;
              break;
              case "406":
              this.E406=true;
              this.toastr.error('You can not work at this time', 'Oops!');
              this.doCheckIn = false;
              this.doCheckOut = false;
              break;
              case "500":
              this.E500=true;
              this.toastr.error('You can not do more than 3 check-in the same day', 'Oops!');
              this.doCheckIn = false;
              this.doCheckOut = false;
              break;
            }
          });
        }, 1000);
      }

      getIp(){
    this._http.get("https://ipinfo.io/").subscribe((data) => {
      let ip : any = data;
      if (ip.ip != null){
        this.IP = ip.ip;
      }else{
        this.IP = "0.0.0.0";
      }
    });
  }

  timeCheckOut(){
    this.getIp();
    this.services.getLastCheckIn().subscribe((data)=>{
      this.fechaCheckIn = new Date(data.response_date);
      this.services.getDateNow().subscribe((data)=>{
        this.fechaNow = new Date(data.response_date);
        let waitTime = this.fechaNow - this.fechaCheckIn;
            if (waitTime > 10){
              this.doCheckIn = true;
              this.doCheckOut = false;
              setTimeout(() => {
              this.services.postCheckOut(this.IP).subscribe( (data)=>{
                switch(data.response_code){
                  case "200":
                      this.checkOutTime = data.response_date;
                      this.toastr.success('Good Job!', 'Success!');
                      this.timeCheckout = true;
                      // setTimeout(() => {
                      //   this.startTiming();
                      // }, 100);
                      break;
                  case "202":
                      this.checkOutTime = data.response_date;
                      this.toastr.warning("You're leaving very soon, aren't you?", 'Alert!');
                      this.E202=true;
                      this.timeCheckout = true;
                      // setTimeout(() => {
                      //   this.startTiming();
                      // }, 100);
                      break;
                  case "406":
                      this.E406=true;
                      this.toastr.error('You should be with your family', 'Oops!');
                      break;
                }
              });
            }, 1000);
              this.readyCheckOut = false;
            }else{
              this.toastr.error('You should wait 5 minute to do checkout', 'Oops!');
            }
      });
    });
  }
  alertTimeFar(){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();
    let day = this.whatDayIsIt(yyyy, mm, dd);
    let maxTotalHours = 10.5;
    let maxFridayTotalHours = 7.5;
    let totalHours = this.hoursMock.split(":");
    let totalWeekHours = parseInt(totalHours[0]) + (parseInt(totalHours[1])/60);

    if(day > 0 && day < 4){
      if((totalWeekHours + ((day-1)*maxTotalHours)+maxFridayTotalHours) < 40){
        this.toastr.warning('You are far from reaching your weekly hours', 'Be careful!');
      }
    }
  }

  alertTimeNear(){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();
    let day = this.whatDayIsIt(yyyy, mm, dd);
    let maxTotalHours = 10.5;
    let maxFridayTotalHours = 7.5;
    let totalHours = this.hoursMock.split(":");
    let totalWeekHours = parseInt(totalHours[0]) + (parseInt(totalHours[1])/60);

    if(day > 0 && day < 3){
      if((totalWeekHours + ((day)*maxTotalHours)+maxFridayTotalHours) > 40){
        this.toastr.warning('You are close to reaching your weekly hours', 'Schedule your work time!');
      }
    }
  }

  whatDayIsIt(year, month, day){
    let d= new Date(year+"-"+month+"-"+day);
    let actualDay = d.getDay();
    if (actualDay % 2 == 0) {
      return 3;
    }
    if (actualDay % 3 == 0) {
      return 2;
    }
    else if (actualDay % 4 == 0){
      return 1;
    }
    return 0;
  }
}
