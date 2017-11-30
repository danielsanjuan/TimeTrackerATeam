import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  weekReport: boolean = true;
  monthReport: boolean = false;

  employees = [];
employeesMonthly1 = [];
employeesMonthly = [{
  "first_name": "Amblyrhynchus cristatus",
  "hours":[ 9,
   9,
   10,
   11,
   11,
   0,
   0,
   12,
   9,
   10,
   11,
   12,
   0,
   0,
   11,
   12,
   10,
   8,
   12,
   0,
   0,
   11,
   9,
   11,
   9,
   12,
   0,
   0,
   8,
   12,
   9],
  "total": 160
},  
{ "first_name": "mecagoentusmuertos cristatus",
"hours":[ 9,
 9,
 10,
 11,
 11,
 0,
 0,
 12,
 9,
 10,
 11,
 12,
 0,
 0,
 11,
 12,
 10,
 8,
 12,
 0,
 0,
 11,
 9,
 11,
 9,
 12,
 0,
 0,
 8,
 12,
 9],
"total": 160}];






  constructor() {}

  ngOnInit() {
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
