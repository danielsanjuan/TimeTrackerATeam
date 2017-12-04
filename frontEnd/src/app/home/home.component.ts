import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Moment, invalid } from 'moment';
import * as moment from 'moment';
import { CheckInService } from '../providers/check-in.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { FormsModule } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  today:string = moment().format('DD MMM YYYY, HH:mm');
  fechaway:any = moment().format('YYYY-MM-DD HH:mm:ss.x');
  hours_today:string;
  hours_week:string;
  nombre:string;
  fechaNow:any = "00:00";
  fechaCheckIn:any = "00:00";
  fechaCheckout:any;
  week:number = 0;
  interval:any;
  timeControl:boolean = false;
  employees = [];

  constructor(private services:CheckInService,
              public toastr: ToastsManager, vcr: ViewContainerRef, 
              private sessionSt: SessionStorageService, 
              private router: Router) {
    if (this.sessionSt.retrieve('email') == null){
      this.router.navigate([''])
    }
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.nombre = this.sessionSt.retrieve('name');
    this.services.getWeeklyReport().subscribe((data) => {
      this.employees = data.response_report;
    });
  }


  time(){
    this.seeTime();
    //this.interval = setInterval(()=>{this.seeTime()},1000); 
    if(this.employees != undefined){
      this.workWeekTime();      
    }
  }

  // stopTime(){
  //   clearInterval(this.interval);
  // }

  seeTime(){
    this.services.getCheckIn().subscribe((data)=>{
      this.fechaCheckIn = new Date(data.response_date);
      if(data.response_date != "No hay fecha de checkin"){
        this.timeControl = true;
      }else{
        this.toastr.error('No has hecho Check In', 'Oops!');        
      }
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
  }

  workWeekTime(){
    for(let i=0; i<=this.employees.length; i++){
      if(this.employees[i].name == this.nombre){
        this.week = parseInt(this.employees[i].total);
        this.week = this.week*3600000; 
      }
    }
  }

}
