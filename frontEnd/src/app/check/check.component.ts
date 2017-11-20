import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NgClass } from '@angular/common'; 
import { CheckInService } from '../providers/check-in.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {
  checkInTime: string;
  checkOutTime: string;
  doClick:boolean = true;

  constructor( private services:CheckInService) { }

  ngOnInit() {
  }
  
  timeCheckIn(){
    // this.checkInTime = moment().format('YYYY/MM/DD, hh:mm:ss');
     this.doClick=false;
    // console.log(this.checkInTime);
    this.services.postCheckIn();
  }

  timeCheckOut(){
    this.checkOutTime = moment().format('YYYY/MM/DD, hh:mm:ss');
    this.doClick=true;
    console.log(this.checkOutTime);
  }
}
