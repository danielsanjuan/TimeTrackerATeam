import { Component, OnInit, ViewContainerRef, Input, NgZone, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { UserService } from '../providers/user.provider';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ActivatedRoute } from '@angular/router';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';
import { NgForm, RequiredValidator } from '@angular/forms';


@Component({
  selector: 'app-user-ip',
  templateUrl: './user-ip.component.html',
  styleUrls: ['./user-ip.component.css']
})
export class UserIpComponent implements OnInit {

  nameUser:string;
  emailUser:string;
  imageUser:any;
  private sub: any;
  email:string;
  dateIn:string;
  dateOut:string;

  ip_address = [];

  constructor(private router: Router,
              private sessionSt: SessionStorageService,
              private services: UserService,
              public toastr: ToastsManager,
              vcr: ViewContainerRef, private route: ActivatedRoute) {
                this.toastr.setRootViewContainerRef(vcr);
    if (this.sessionSt.retrieve('email') == null){
      this.router.navigate([''])
    }
    this.sub = this.route.params.subscribe((params) => {
      this.email = params['email'];
    });
    this.services.getEmployee(this.email).subscribe((data) => {
      this.nameUser = data.employee.name;
      this.emailUser = data.employee.email;
      this.imageUser = data.employee.image;
    });
  }

  ngOnInit() {
    this.services.getPersonalIP(this.email).subscribe((data) => {
      this.ip_address = data.response_list;
    });
  }

  backToAccess() {
    this.router.navigate(['access']);
  }

  setSolved(companyTimeTrackerForm: NgForm){
    if (new Date(companyTimeTrackerForm.value.dateIn) > new Date(companyTimeTrackerForm.value.dateOut)){
      this.toastr.error('Invalid range of date', 'StartDate should be minor than EndDate');
      this.ip_address = [{'date': "-"}];
    }else{
      this.services.getIpFilteredByDate(this.emailUser, companyTimeTrackerForm.value.dateIn,  companyTimeTrackerForm.value.dateOut).subscribe((data) => {
        this.ip_address = data.response_list;
      });
    }
  }

}
