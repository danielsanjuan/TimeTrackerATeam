import { Component, OnInit } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  today:string = moment().format('MMM Do YYYY, h:mm a');
  hours:string = moment().format('LT');

  constructor() { }

  ngOnInit() {
  }

}
