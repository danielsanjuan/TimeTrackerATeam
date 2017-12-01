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

  constructor(private router: Router, private sessionSt: SessionStorageService, private services: CheckInService) {
    if (this.sessionSt.retrieve('email') == null){
      this.router.navigate([''])
    }
  }

  ngOnInit() {
    this.services.getWeeklyReport().subscribe((data) => {
      console.log("estoy dentro")
      console.log(data);
      this.employees = data.response_report;
    });
    this.services.getMontlyReport().subscribe((data) => {
      console.log(data + "HABER KE HOSTIAS ME ESTAS PASANDO IOPUTA");
      this.employeesMonthly = data.response_report;
      this.workerHours = data.response_report.hours_day.hour;
      console.log(this.workerHours);
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
