import { Component, OnInit, ViewContainerRef } from '@angular/core';
import * as moment from 'moment';
import { NgClass } from '@angular/common';
import { CheckInService } from '../providers/check-in.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

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
  employees = [];
  hours_today:string = "00:00";
  hours_week:string = "00:00";
  emailUser:string = "";
  fechaNow:any;
  fechaCheckIn:any;
  fechaCheckout:any;
  week:number = 0;
  interval:any;
  timeControl:boolean = false;
  contador:number = 0;

  constructor( private services:CheckInService,
               private sessionSt: SessionStorageService,
               private router: Router,
               public toastr: ToastsManager, vcr: ViewContainerRef,
               private localSt: LocalStorageService) {
       this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.emailUser = this.sessionSt.retrieve('email');
    this.services.checkWorkedDay().subscribe((data) => {
      console.log(data)
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
      this.services.getWeeklyReport().subscribe((data) => {
        this.employees = data.response_list;
        for(let i=0; i<this.employees.length; i++){
          if(this.employees[i].email == this.emailUser){
            this.week = parseInt(this.employees[i].total);
            this.week = this.week*60000; 
          }
        }
      });
      this.time();
    });
    
  }

  timeCheckIn(){
    console.log(this.contador);
    if(this.contador < 3){
      this.doCheckIn = false;
      this.doCheckOut = true;
      this.services.postCheckIn().subscribe( (data)=>{
        switch(data.response_code){
          case "200":
              this.checkInTime = data.response_date;
              let timeOk = this.checkInTime[7]+""+this.checkInTime[8]+":"+this.checkInTime[10]+""+this.checkInTime[11];
              this.toastr.success('You have made check-in at  '+timeOk, 'Success!');
              break;
          case "202":
              this.checkInTime = data.response_date;
              let timeLate = this.checkInTime[7]+""+this.checkInTime[8]+":"+this.checkInTime[10]+""+this.checkInTime[11];
              this.toastr.warning('You are too late '+ timeLate, 'Alert!');
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
      this.services.getCheckIn().subscribe((data)=>{
          console.log((data.response_date) + " getCheckIn");
          console.log("in "+new Date(data.response_date));
      });
      this.contador++;
    }
  }


  timeCheckOut(){
      this.doCheckIn = true;
      this.doCheckOut = false;
      this.services.postCheckOut().subscribe( (data)=>{
        switch(data.response_code){
          case "200":
              this.checkOutTime = data.response_date;
              this.toastr.success('Good Job!', 'Success!');
              break;
          case "202":
              this.checkOutTime = data.response_date;
              this.toastr.warning("You're leaving very soon, aren't you?", 'Alert!');
              this.E202=true;
              break;
          case "406":
              this.E406=true;
              this.toastr.error('You should be with your family', 'Oops!');
              break;
        }
      });
      if(this.contador>2){
        this.doCheckIn = false;
        this.doCheckOut = false;
      }
      //clearInterval(this.timer);
  }
  
  time(){
    this.seeTime();
  }

  seeTime(){
    this.services.getCheckIn().subscribe((data)=>{
      this.fechaCheckIn = new Date(data.response_date);
      if(data.response_date == "No hay fecha de checkin"){
        this.hours_today = "00:00";
        this.hours_week = "00:00";
      }else{
        this.services.getDateNow().subscribe((data)=>{
          this.fechaNow = new Date(data.response_date);
          this.services.getCheckout().subscribe((data)=>{
            this.fechaCheckout = new Date(data.response_date);
            if(data.response_date == "No hay fecha de checkout"){
              this.workDayTime(this.fechaCheckIn, this.fechaNow);
            }else{
              this.workDayTime(this.fechaCheckIn, this.fechaCheckout);
            }
          });
        });        
      }
    });
  }

  workDayTime(dateCheck, dateNow){
    let timetoday = (dateNow - dateCheck);
    let time = new Date(timetoday);
    this.hours_today = time.toTimeString().split(' ')[0];
    this.hours_today = this.hours_today.split(':')[0]+":"+this.hours_today.split(':')[1];
    let timeOfWeek = ((dateNow - dateCheck)); 
    let timeWeek = new Date(timeOfWeek+this.week);
    this.hours_week = timeWeek.toTimeString().split(' ')[0];
    this.hours_week = this.hours_week.split(':')[0]+":"+this.hours_week.split(':')[1];
    //this.timer = setInterval(() => this.clock(), 1000);
  }

  clock(){
    console.log("FUNCIONA")
    let min = parseInt(this.hours_today.split(':')[1]);
    let hour = parseInt(this.hours_today.split(':')[0]);
    let contMinute = 1;
    let contHour = 1;
    if(min < 10 && hour>10){
      min += contMinute;
      this.hours_today = hour+":0"+min;
    }if(min < 10 && hour<10){
      min += contMinute;
      this.hours_today = "0"+hour+":0"+min;
    }
    if(min >= 10 && hour>10){
      min += contMinute;
      this.hours_today = hour+":"+min;
    }if(min >= 10 && hour<10){
      min += contMinute;
      this.hours_today = "0"+hour+":"+min;
    }if(min > 59 && hour>10){
      min = 0;
      hour += contHour;
      this.hours_today = hour+":0"+min;
      contHour++;
    }if(min > 59 && hour<10){
      min = 0;
      hour += contHour;
      this.hours_today = "0"+hour+":0"+min;
      contHour++;
    }
    contMinute++;
    
  }

}
