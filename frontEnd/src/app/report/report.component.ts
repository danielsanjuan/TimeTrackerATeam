import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { CheckInService } from '../providers/check-in.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  weekReport: boolean = true;
  monthReport: boolean = false;

  employees = [];
  employeesMonthly = [];
  workerHours = [];
  totalDays; 
  mes = [];

  constructor(private router: Router, private sessionSt: SessionStorageService, private services: CheckInService) {
    if (this.sessionSt.retrieve('email') == null){
      this.router.navigate([''])
    }
  }

  ngOnInit() {
    this.services.getWeeklyReport().subscribe((data) => {
      if (data.response_report != undefined){
        this.employees = data.response_report;
      }
    });
    this.services.getMontlyReport().subscribe((data) => {
      if (data.response_report != undefined){
        console.log(data.response_report[0].month);
        console.log(data.response_report[0].year);
        console.log(data.response_report[0])
        if(data.response_report.month == 2){
          this.totalDays=28;
        }
        else if (data.response_report.month == 4 || data.response_report.month == 6 || data.response_report.month == 9 || data.response_report.month == 10) this.totalDays=30;
        else this.totalDays = 31
        for(let k=0; k<this.totalDays; k++) this.mes[k] = 0;
        

        this.employeesMonthly = data.response_report;
        this.workerHours = data.response_report.hours_day;
        for(let i in this.employeesMonthly){
          for(let k=0; k<this.totalDays; k++) this.mes[k] = 0;
          if(this.employeesMonthly[i].hours_day != undefined){
          
            for(let j=0; j < this.employeesMonthly[i].hours_day.length; j++){ 
            
              this.mes[this.employeesMonthly[i].hours_day[j].day] = this.employeesMonthly[i].hours_day[j].hour; 
            }

          }
            this.employeesMonthly[i].hours_day = [];
            this.employeesMonthly[i].hours_day = [].concat(this.mes);
        }
      }
    });
  }

  weekReportButton(){
    this.monthReport = false;
    this.weekReport = true;
  }

  monthReportButton(){
    this.weekReport = false;
    this.monthReport = true;
  }
}
