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
  timer2:any;
  hoursWorked:any = 0;
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
  timeMileSecond:number = 0;

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
      this.services.getWorkedHoursToday().subscribe((data)=>{
        this.hoursWorked=data.response_date;
        this.hours_today = this.hourFormat(new Date(parseInt(this.hoursWorked)));
        //console.log("DIFEEEEEEE "+ data.response_date);
        this.services.getWeeklyReport().subscribe((data) => {
          this.employees = data.response_list;
          for(let i=0; i<this.employees.length; i++){
            if(this.employees[i].email == this.emailUser){
              this.week = parseInt(this.employees[i].total);
              this.week = this.week*60000;
            }
          }
          //console.log("WEKEEEEEEE "+ this.employees[i].total);
          this.hours_week = this.hourFormat(new Date(this.week));
          //console.log("HOUREEEEEEE "+ this.hours_week);
          if(this.doCheckOut){
            this.seeTime();
          }
        });
      });
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
      let timeNow;
      let timeCheckIn;
      this.services.getLastCheckIn().subscribe((data)=>{
        timeCheckIn = new Date(data.response_date);
        this.services.getDateNow().subscribe((data)=>{
          timeNow = new Date(data.response_date);
          let waitTime = timeNow - timeCheckIn;
              if (waitTime > 10000){
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
              }else{
                this.toastr.error('You should wait 5 minute to do checkout', 'Oops!');
              } 
        });
      });
  }

  seeTime(){
    // this.services.getCheckIn().subscribe((data)=>{
    //   this.fechaCheckIn = new Date(data.response_date);
    //  // console.log("Checking" + data.response_date);
    //   this.services.getDateNow().subscribe((data)=>{
    //     this.fechaNow = new Date(data.response_date);
    //     //console.log("DateNow" + data.response_date);
    //     this.services.getCheckout().subscribe((data)=>{
    //       this.fechaCheckout = new Date(data.response_date);
    //       if(this.timeCheckout){
    //         console.log("CHECKOUT AAAAAAAAAAAAA")
    //         this.mileSeconds = (this.fechaCheckout -this.fechaCheckIn);
    //         console.log("Mileseconds "+this.mileSeconds);
    //         this.workDayTimeToday(this.mileSeconds);
    //         this.workDayTimeWeek(this.mileSeconds);
    //       }else{
    //         this.mileSeconds = (this.fechaNow - this.fechaCheckIn);
    //         console.log("Mileseconds "+this.mileSeconds);
    //         this.workDayTimeToday(this.mileSeconds + parseInt(this.hoursWorked));
    //         this.workDayTimeWeek(this.mileSeconds);
            
    //       }
    //     }); 
    //   });        
    // });
    this.workDayTimeToday(this.hoursWorked);
    this.workDayTimeWeek(this.hoursWorked);
  }
  
  workDayTimeToday(data){
    //console.log("DATAAA "+data);
    let fecha = new Date(data);
    //console.log("FECHAAAA"+fecha);
    
    if(this.timeCheckout){
      clearInterval(this.timer);    
    }else{
      this.timer = setInterval(() => {
        this.hours_today = this.hourFormat(fecha);
      }, 1000);
      let waitTime = this.fechaNow - this.fechaCheckIn;
      if (waitTime > 10000){
        this.readyCheckOut = true;
      } 
    }
  }

  workDayTimeWeek(data){
    //console.log(typeof data);
    //console.log(typeof this.week);
    let dataWeek = parseInt(data) + this.week;
    let fechaW = new Date(dataWeek);
    if(this.timeCheckout){
      clearInterval(this.timer2);
      this.hoursWorked = this.hoursWorked + this.timeMileSecond;     
    }else{
      this.timer2 = setInterval(() => {
        this.hours_week = this.hourFormat(fechaW);
      }, 1000);
      let waitTime = this.fechaNow - this.fechaCheckIn;
    }
  }

  hourFormat(fecha){
    //console.log("AAAAAAAAAA "+ fecha);
    let dia = fecha.getDate();
    let horas = fecha.getHours() + (dia-1) * 24;
    let horaT = (horas<=9)?"0"+horas:horas;
    let minuto = (fecha.getMinutes()<=9)?"0"+fecha.getMinutes():fecha.getMinutes();
    let secondsIncrease = fecha.getSeconds();
    fecha.setSeconds(secondsIncrease+1);
    let milesegundos = parseInt(fecha.getMilliseconds())
    this.timeMileSecond = parseInt(fecha.setMilliseconds(milesegundos));
    //console.log("MILESECONDS "+this.timeMileSecond);
    return horaT+":"+minuto+":"+secondsIncrease;
  }


}
