import { Component } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  today:string = moment().format('MMM Do YYYY, h:mm a');
  hours:string = moment().format('LT');
}
