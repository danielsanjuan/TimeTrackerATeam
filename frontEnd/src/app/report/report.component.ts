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

  constructor(private router: Router, private sessionSt: SessionStorageService, private services: CheckInService) {
    if (this.sessionSt.retrieve('email') == null){
      this.router.navigate([''])
    }
  }

  ngOnInit() {
    this.services.getWeeklyReport().subscribe((data) => {
      console.log("estoy dentro")
      console.log(data.response_report);
      this.employees = data.response_report;
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
