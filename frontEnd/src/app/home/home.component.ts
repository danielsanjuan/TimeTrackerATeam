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
  hours_today:string;
  checkInTime:string;


  constructor(private services:CheckInService) { }

  ngOnInit() {
  }

  time(){
    this.services.getCheckIn().subscribe((data)=>{
      console.log(data);
      this.checkInTime = data.response_date;
      this.timeToday(this.checkInTime, this.hours);
    });
  }

  timeToday(dateT, dateN){
        let fechaT:string = dateT.split("");
        let fechaN:string = dateN.split("");
        let horasT = fechaT[11];
        horasT += fechaT[12];
        let minT = fechaT[14];
        minT += fechaT[15];
        let horasN = fechaN[0];
        horasN += fechaN[1];
        let minN = fechaN[3];
        minN += fechaN[4];
        let hora_checkIn = parseInt(horasT);
        let min_checkIn = parseInt(minT);
        let hora_now = parseInt(horasN);
        let min_now = parseInt(minN);
        let dif_hour = hora_now - hora_checkIn;
        let dif_min = min_now - min_checkIn;
        if(dif_min<0){
          dif_hour -= 1;
          dif_min += 60;
        }
        if(dif_hour<10 && dif_min<10){
          this.hours_today = "0"+dif_hour.toString()+":0"+dif_min.toString();
        }
        if(dif_hour<10 && dif_min>10){
          this.hours_today = "0"+dif_hour.toString()+":"+dif_min.toString();
        }
        if(dif_hour>10 && dif_min<10){
          this.hours_today = dif_hour.toString()+":0"+dif_min.toString();
        }
        if(dif_hour>10 && dif_min>10){
          this.hours_today = dif_hour.toString()+":"+dif_min.toString();
        }
     }

}
