import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { CheckInService } from '../providers/check-in.service';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';
import { NgModel } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

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
  today: string;
  dateToday: Date;
  modalRef: BsModalRef;
  currentUser: any = [];

  constructor(private router: Router,
    private sessionSt: SessionStorageService,
    private modalService: BsModalService,
    private services: CheckInService) {
      if (this.sessionSt.retrieve('email') == null){
        this.router.navigate([''])
      }
     }

  ngOnInit() {
    this.services.getDateNow().subscribe((data) => {
      let separate = data.response_date.split(" ");
      let date = separate[0].split("-");
      this.today = date[2]+"-"+date[1]+"-"+date[0];
      this.services.getDailyIpReport(this.today).subscribe((data) => {
        if (data.response_list != undefined){
          this.employees = data.response_list;
          this.setResponsiveName(this.employees);
        }else{
          this.employees = [];
        }
      });
      this.dateToday = new Date(data.response_date);
    });
    if (this.sessionSt.retrieve('email') == null){
      this.router.navigate([''])
    }
    this.setResponsiveName(this.employees);
  }

  onDateChanged(event: IMyDateModel): void {
    let re = /\./gi;
    this.dateToday = event.jsdate;
    //realizar llamada al metodo del servicio
    this.services.getDailyIpReport(event.formatted.replace(re, '-')).subscribe((data) => {
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

  openModal(template: TemplateRef<any>, currentUser){
    this.currentUser = currentUser;
    this.modalRef = this.modalService.show(template);
  }

}
