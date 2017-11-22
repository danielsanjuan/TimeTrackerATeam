import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NgClass } from '@angular/common'; 
import { CheckInService } from '../providers/check-in.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {
  checkInTime: string = "Funciona";
  checkOutTime: string = "" ;
  doClick:boolean = true;

  constructor( private services:CheckInService,
               private router: Router) { }

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
