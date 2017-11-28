import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  weekReport: boolean = true;
  monthReport: boolean = false;

  employees = [{
    "first_name": "Roderigo",
    "last_name": "Donovin",
    "total": 40,
    "monday": 8,
    "tuesday": 2,
    "wednesday": 12,
    "thursday": 7,
    "friday": 7
  },
  {
    "first_name": "Flo",
    "last_name": "Shiel",
    "total": 40,
    "monday": 10,
    "tuesday": 5,
    "wednesday": 9,
    "thursday": 8,
    "friday": 2
  },
  {
    "first_name": "Dionis",
    "last_name": "Gergus",
    "total": 23,
    "monday": 1,
    "tuesday": 8,
    "wednesday": 10,
    "thursday": 3,
    "friday": 11
  },

  {
    "first_name": "Herrick",
    "last_name": "Girling",
    "total": 34,
    "monday": 1,
    "tuesday": 5,
    "wednesday": 10,
    "thursday": 11,
    "friday": 7
  },

  {
    "first_name": "Cathyleen",
    "last_name": "Anwyl",
    "total": 40,
    "monday": 4,
    "tuesday": 1,
    "wednesday": 7,
    "thursday": 11,
    "friday": 12
  },

  {
    "first_name": "Charis",
    "last_name": "Donati",
    "total": 35,
    "monday": 4,
    "tuesday": 12,
    "wednesday": 1,
    "thursday": 4,
    "friday": 9
  },

  {
    "first_name": "Pedro",
    "last_name": "Smelley",
    "total": 35,
    "monday": 6,
    "tuesday": 6,
    "wednesday": 2,
    "thursday": 9,
    "friday": 7
  },

  {
    "first_name": "Sanderson",
    "last_name": "Hitzmann",
    "total": 46,
    "monday": 5,
    "tuesday": 5,
    "wednesday": 11,
    "thursday": 4,
    "friday": 1
  },

  {
    "first_name": "Demetrius",
    "last_name": "Chrystie",
    "total": 40,
    "monday": 6,
    "tuesday": 6,
    "wednesday": 2,
    "thursday": 1,
    "friday": 3
  },

  {
    "first_name": "Salim",
    "last_name": "Southern",
    "total": 12,
    "monday": 10,
    "tuesday": 3,
    "wednesday": 7,
    "thursday": 9,
    "friday": 9
  },

  {
    "first_name": "Emilie",
    "last_name": "Gjerde",
    "total": 45,
    "monday": 2,
    "tuesday": 1,
    "wednesday": 1,
    "thursday": 5,
    "friday": 8
  },

  {
    "first_name": "Gill",
    "last_name": "Gregson",
    "total": 43,
    "monday": 5,
    "tuesday": 2,
    "wednesday": 8,
    "thursday": 7,
    "friday": 12
  }
];

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
