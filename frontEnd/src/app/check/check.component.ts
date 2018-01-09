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
  timeCheckout:boolean;
  mileSeconds:number = 0;
  readyCheckOut:boolean = false;

  hoursMock:string = '09:00';
  hoursMockWeek:string = '23:00';

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
      if(this.doCheckOut){
        this.seeTime();
        this.AlertTime();
      }
    });

  }

  timeCheckIn(){
      this.doCheckIn = false;
      this.doCheckOut = true;
      this.services.postCheckIn().subscribe( (data)=>{
        switch(data.response_code){
          case "200":
              this.checkInTime = data.response_date;
              let timeOk = this.checkInTime[7]+""+this.checkInTime[8]+":"+this.checkInTime[10]+""+this.checkInTime[11];
              this.toastr.success('You have made check-in at  '+timeOk, 'Success!');
              this.timeCheckout = false;
              setTimeout(() => {
                this.seeTime();
              }, 100);
              break;
          case "202":
              this.checkInTime = data.response_date;
              let timeLate = this.checkInTime[7]+""+this.checkInTime[8]+":"+this.checkInTime[10]+""+this.checkInTime[11];
              this.toastr.warning('You are too late '+ timeLate, 'Alert!');
              this.timeCheckout = false;
              setTimeout(() => {
                this.seeTime();
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
  }

  timeCheckOut(){
      let timeNow
      this.services.getDateNow().subscribe((data)=>{
        timeNow = new Date(data.response_date);
        let waitTime = timeNow - this.fechaCheckIn;
            if (waitTime > 10000){
              this.readyCheckOut = true;
            } 
      });
      setTimeout(() => {
        if(!this.readyCheckOut){
          this.toastr.error('You should wait 5 minute to do checkout', 'Oops!');
        }else{
          this.doCheckIn = true;
          this.doCheckOut = false;
          this.services.postCheckOut().subscribe( (data)=>{
            switch(data.response_code){
              case "200":
                  this.checkOutTime = data.response_date;
                  this.toastr.success('Good Job!', 'Success!');
                  this.timeCheckout = true;
                  setTimeout(() => {
                    this.seeTime();
                  }, 100);
                  break;
              case "202":
                  this.checkOutTime = data.response_date;
                  this.toastr.warning("You're leaving very soon, aren't you?", 'Alert!');
                  this.E202=true;
                  this.timeCheckout = true;
                  setTimeout(() => {
                    this.seeTime();
                  }, 100);
                  break;
              case "406":
                  this.E406=true;
                  this.toastr.error('You should be with your family', 'Oops!');
                  break;
            }
          });
          this.readyCheckOut = false;
        }
      }, 100);
    }

  seeTime(){
    let mileSeg;
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
            mileSeg = this.fechaCheckout -this.fechaCheckIn;
            if(data.response_date != "No hay fecha de checkout" || mileSeg > 0 ){
              this.mileSeconds = (this.fechaCheckout -this.fechaCheckIn);
              this.workDayTime(this.mileSeconds);
            }else{
              this.mileSeconds = (this.fechaNow - this.fechaCheckIn);
              this.workDayTime(this.fechaNow - this.fechaCheckIn);
            }
          }); 
        });        
      }
    });
  }
  
  workDayTime(data){
    let fecha = new Date(data);
    let dataWeek = data + this.week;
    let fechaW = new Date(dataWeek);
    if(this.timeCheckout){
      clearInterval(this.timer);    
    }else{
      this.timer = setInterval(() => {
        let horaT = (fecha.getHours()<=9)?"0"+fecha.getHours():fecha.getHours();
        let minuto = (fecha.getMinutes()<=9)?"0"+fecha.getMinutes():fecha.getMinutes();
        let secondsIncrease = fecha.getSeconds();
        fecha.setSeconds(secondsIncrease+1);
        this.hours_today = horaT+":"+minuto+":"+secondsIncrease;
        let horaWT = (fechaW.getHours()<=9)?"0"+fechaW.getHours():fechaW.getHours();
        let minutoW = (fechaW.getMinutes()<=9)?"0"+fechaW.getMinutes():fechaW.getMinutes();
        let secondsIncreaseW = fechaW.getSeconds();
        fechaW.setSeconds(secondsIncreaseW+1);
        this.hours_week = horaWT+":"+minutoW;
      }, 1000);
      let waitTime = this.fechaNow - this.fechaCheckIn;
      if (waitTime > 10000){
        this.readyCheckOut = true;
      } 
    }
  }

AlertTime(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  var maxTotalHours = 10.5;
  var maxFridayTotalHours = 7.5;
  console.log(1);
  if(3 == 3){
    var totalHours = this.hoursMock.split(":");
    var totalWeekHours = parseInt(totalHours[0]) + (parseInt(totalHours[1])/60); 
    console.log(totalWeekHours);
    if((totalWeekHours + ((3-1)*maxTotalHours)+maxFridayTotalHours) < 40) this.toastr.warning('You are far from from reaching your weekly hours', 'Alert!');
  }
  else if (this.whatDayIsIt(yyyy, mm, dd) == 2){
    if(this.hoursMockWeek > "22:59" && this.hoursMockWeek < "24:01") this.toastr.warning('You are far from from reaching your weekly hours', 'Alert!');
  }

}

whatDayIsIt(year, month, day){

  var d= new Date(year+"-"+month+"-"+day);
  var actualDay = d.getDay();
  if (actualDay % 3 == 0) {
    return 3
  }
  else if (actualDay % 4 == 0){
    return 2;
  }

  return 0;
  } 

}
