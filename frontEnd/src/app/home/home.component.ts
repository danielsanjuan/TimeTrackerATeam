import { Component, OnInit } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { CheckInService } from '../providers/check-in.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';


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

  constructor(private services:CheckInService, private sessionSt: SessionStorageService, private router: Router) {
    if (this.sessionSt.retrieve('email') == null){
      this.router.navigate([''])
    }
  }

  ngOnInit() {
    this.nombre = this.sessionSt.retrieve('name');
  }


  time(){
    this.services.getCheckIn().subscribe((data)=>{
      console.log((data) + "hola estoy haciendo el getCheckIn");
      this.fechaCheckIn = new Date(data.response_date);
      console.log("in "+this.fechaCheckIn);
    });
    this.services.getDateNow().subscribe((data)=>{
      console.log("Hola estoy estrando en el getDateNow");
      this.fechaNow = new Date(data.response_date);
      console.log("now "+this.fechaNow);
    });
    this.workDayTime(this.fechaCheckIn, this.fechaNow);

  }

  workDayTime(dateCheck, dateNow){
    let timetoday = (dateNow - dateCheck);
    let time = new Date(timetoday);
    this.hours_today = time.toTimeString().split(' ')[0];
    this.hours_today = this.hours_today.split(':')[0]+":"+this.hours_today.split(':')[1];
    let timeOfWeek = ((dateNow - dateCheck)+54000000);
    let timeWeek = new Date(timeOfWeek);
    this.hours_week = time.toTimeString().split(' ')[0];
    this.hours_week = this.hours_week.split(':')[0]+":"+this.hours_week.split(':')[1];

  }

}
