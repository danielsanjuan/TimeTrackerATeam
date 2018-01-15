import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { CheckInService } from '../providers/check-in.service';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css']
})
export class AccessComponent implements OnInit {
  myOptions: INgxMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy'
  };
  responsiveName: string[] = [];
  employees: any = [];


  constructor(private router: Router,
    private sessionSt: SessionStorageService,
    private services: CheckInService) { }

  ngOnInit() {
    if (this.sessionSt.retrieve('email') == null){
      this.router.navigate([''])
    }
    this.setResponsiveName(this.employees);
  }

  onDateChanged(event: IMyDateModel): void {
    let re = /\./gi;
    console.log(event.formatted);
    console.log(event.formatted.replace(re, '-'))
    //realizar llamada al metodo del servicio
    this.services.getDailyIpReport(event.formatted.replace(re, '-')).subscribe((data) => {
      console.log(data);
      if (data.response_list != undefined){
        this.employees = data.response_list;
        this.setResponsiveName(this.employees);
      }else{
        this.employees = [];
      }
    });
  }

  goToPersonalIps(email){
    this.router.navigate(['/userIP', email]);
  }

  setResponsiveName(employees){
    for (var i = 0; i < employees.length; i++) {
      let separate = employees[i].response_list_employee.name.split(" ");
      if(separate.length>3){
        this.responsiveName[i] = separate[0]+" "+separate[2];
      }else{
        this.responsiveName[i] = separate[0]+" "+separate[1];
      }
    }
  }
}
