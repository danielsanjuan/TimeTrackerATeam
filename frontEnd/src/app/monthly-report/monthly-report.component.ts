import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { CheckInService } from '../providers/check-in.service';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { IMyDateModel, INgxMyDpOptions } from 'ngx-mydatepicker';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';

@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.css']
})
export class MonthlyReportComponent implements OnInit {
  weekReport: boolean = true;
  monthReport: boolean = false;
  firstSat;
  employees = [];
  employeesMonthly = [];
  workerHours = [];
  totalDays;
  mes = [];
  currentMonth;
  currentyear;
  myOptions: INgxMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',

  };

  constructor(private router: Router, private sessionSt: SessionStorageService, private services: CheckInService) {
    if (this.sessionSt.retrieve('email') == null){
      this.router.navigate([''])
    }
  }

  ngOnInit() {
    this.services.getMontlyReport().subscribe((data) => {
      this.checkMonth(data);
    });
  }


  leapYear(year){
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
  }


  firstSaturday(year, month){
    var dia = 1;
    console.log("en firstsaturday año y mes" + year + "  "+ month)
    var d= new Date(year+"-"+month+"-"+dia);
    var day = d.getDay();
    while(day != 6) {
      d.setDate(dia);
      day = d.getDay();
      dia++;
    }
    return dia;
  }

  setTextCurrentMonth(month){
    if (month == 1) this.currentMonth = "January";
    else
      if (month == 2) this.currentMonth = "February";
      else
      if (month == 3) this.currentMonth = "March";
      else
      if (month == 4) this.currentMonth = "April";
      else
      if (month == 5) this.currentMonth = "May";    
      else
      if (month == 6) this.currentMonth = "June";
      else
      if (month == 7) this.currentMonth = "July";
      else
      if (month == 8) this.currentMonth = "August";
      else
      if (month == 9) this.currentMonth = "September";
      else
      if (month == 10) this.currentMonth = "October";
      else
      if (month == 11) this.currentMonth = "November";
      else
      if (month == 12) this.currentMonth = "December";

    return this.currentMonth;
  }

  checkMonth(data){
    
    this.currentMonth = "";
    this.currentyear = "";
    console.log (data)
      if (data.response_report != undefined){
        this.currentyear = data.response_report[0].year;
        this.firstSat = this.firstSaturday(data.response_report[0].year, data.response_report[0].month);
        this.currentMonth = this.setTextCurrentMonth(data.response_report[0].month);


        if(data.response_report[0].month == 2){
          if(this.leapYear(data.response_report[0].year)) this.totalDays = 29;
          else this.totalDays=28;
        }
        else {
          if (data.response_report[0].month == 4 || data.response_report[0].month == 6 || data.response_report[0].month == 9 || data.response_report[0].month == 11){
             this.totalDays=30;
          }
          else this.totalDays = 31;

        }

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
      else{
        console.log("mes vacío");
        this.employeesMonthly = [];
      }
  }

  onDateChanged(event: IMyDateModel): void {
    //realizar llamada al metodo del servicio
    this.services.getMonthlyReportWithDate(event.formatted).subscribe((data) => {
      if (data.response_report != undefined){
        console.log("mes day picker   " + data.response_report[0].month + "    año de date picker" + data.response_report[0].year);
        this.checkMonth(data);
      }
      else{
        this.employeesMonthly = [];
      }
    });
  }

  isWeekend(day){
    return ((day-this.firstSat)%7 == 0|| (day-this.firstSat)%7 == 1);
  }
}
