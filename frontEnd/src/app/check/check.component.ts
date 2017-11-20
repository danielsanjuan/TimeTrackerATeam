import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NgClass } from '@angular/common'; 

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {
  checkInTime: string;
  checkOutTime: string;
  doClick:boolean = true;

  constructor() { }

  ngOnInit() {
  }
  
  timeCheckIn(){
    this.checkInTime = moment().format('YYYY/MM/DD, hh:mm:ss');
    this.doClick=false;
    console.log(this.checkInTime);
  }

  timeCheckOut(){
    this.checkOutTime = moment().format('YYYY/MM/DD, hh:mm:ss');
    this.doClick=true;
    console.log(this.checkOutTime);
  }
}
