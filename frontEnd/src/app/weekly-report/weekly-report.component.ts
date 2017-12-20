import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { CheckInService } from '../providers/check-in.service';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-weekly-report',
  templateUrl: './weekly-report.component.html',
  styleUrls: ['./weekly-report.component.css']
})
export class WeeklyReportComponent implements OnInit {
  employees = [];
  myOptions: INgxMyDpOptions = {
      // other options...
      dateFormat: 'dd.mm.yyyy',
      showWeekNumbers: true
  };
  
  // Initialized to specific date (09.10.2018)

  constructor(private router: Router, private sessionSt: SessionStorageService, private services: CheckInService) {
    if (this.sessionSt.retrieve('email') == null){
      this.router.navigate([''])
    }
  }
  // optional date changed callback
  onDateChanged(event: IMyDateModel): void {
      //realizar llamada al metodo del servicio
      this.services.getWeeklyReportWithDate(event.formatted).subscribe((data) => {
        if (data.response_list != undefined){   
          this.employees = data.response_list;
        }else{
          this.employees = [];
        }     
      });
  }

  ngOnInit() {
    this.services.getWeeklyReport().subscribe((data) => {
      if (data.response_list){
        this.employees = data.response_list;
      }
    });
  }

}
