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
    }

  seeTime(){
    this.services.getCheckIn().subscribe((data)=>{
      let mileSeconds;
      this.fechaCheckIn = new Date(data.response_date);
      if(data.response_date == "No hay fecha de checkin"){
        this.hours_today = "00:00";
        this.hours_week = "00:00";
      }else{
        this.services.getDateNow().subscribe((data)=>{
          this.fechaNow = new Date(data.response_date);
          this.services.getCheckout().subscribe((data)=>{
            this.fechaCheckout = new Date(data.response_date);
            mileSeconds = this.fechaCheckout -this.fechaCheckIn;
            if(data.response_date != "No hay fecha de checkout" || mileSeconds > 0 ){
              this.workDayTime(this.fechaCheckout - this.fechaCheckIn);
            }else{
              this.workDayTime(this.fechaNow - this.fechaCheckIn);
            }
          }); 
        });        
      }
    });
  }
  
  workDayTime(mileSeconds){
    let fecha = new Date(mileSeconds);
    let mileSecondsWeek = mileSeconds + this.week;
    let fechaW = new Date(mileSecondsWeek);
    if(this.timeCheckout){
      clearInterval(this.timer);    
    }else{
      this.timer = setInterval(() => {
        let horaT = (fecha.getHours()<=9)?"0"+fecha.getHours():fecha.getHours();
        let minuto = (fecha.getMinutes()<=9)?"0"+fecha.getMinutes():fecha.getMinutes();
        let secondsIncrease = fecha.getSeconds();
        fecha.setSeconds(secondsIncrease+1);
        this.hours_today = horaT+":"+minuto;
        let horaWT = (fechaW.getHours()<=9)?"0"+fechaW.getHours():fechaW.getHours();
        let minutoW = (fechaW.getMinutes()<=9)?"0"+fechaW.getMinutes():fechaW.getMinutes();
        let secondsIncreaseW = fechaW.getSeconds();
        fechaW.setSeconds(secondsIncreaseW+1);
        this.hours_week = horaWT+":"+minutoW;
      }, 1000);
    }
  }

}
