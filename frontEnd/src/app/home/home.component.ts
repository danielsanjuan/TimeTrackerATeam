import { Component, OnInit } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { CheckInService } from '../providers/check-in.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  today:string = moment().format('MMM Do YYYY, h:mm a');
  hours:string = moment().format('HH:mm');
  fechaway:any = moment().format('YYYY-MM-DD HH:mm:ss.x');
  hours_today:string;

  constructor(private services:CheckInService) { }

  ngOnInit() {
  }

  time(){
    this.services.getCheckIn().subscribe((data)=>{
      let fechaCheckIn = new Date(data.response_date);
      let fechaNow = new Date(this.fechaway);
      this.workDayTime(fechaCheckIn, fechaNow);
    });
  }

  workDayTime(dateCheck, dateNow){
      let hours = ((dateNow - dateCheck)/3600000);
      let minutes = ((hours*60)%60);
      alert(minutes);
      alert(hours.toFixed(0));
      if(hours<10 && minutes<10){
        this.hours_today = "0"+hours.toFixed(0)+":0"+minutes.toFixed(0);
      }
      if(hours<10 && minutes>10){
        this.hours_today = "0"+hours.toFixed(0)+":"+minutes.toFixed(0);
      }
      if(hours>10 && minutes<10){
        this.hours_today = hours.toFixed(0)+":0"+minutes.toFixed(0);
      }
      if(hours>10 && minutes>10){
        this.hours_today = hours.toFixed(0)+":"+minutes.toFixed(0);
      }
      alert(this.hours_today);
  }

}
