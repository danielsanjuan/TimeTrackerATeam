import { Component, OnInit, ViewContainerRef, Input, NgZone, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { UserService } from '../providers/user.provider';
import { CheckInService } from '../providers/check-in.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ActivatedRoute } from '@angular/router';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';
import { NgForm, RequiredValidator, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-user-ip',
  templateUrl: './user-ip.component.html',
  styleUrls: ['./user-ip.component.css']
})
export class UserIpComponent implements OnInit {

  modalRef: BsModalRef;
  nameUser:string;
  emailUser:string;
  imageUser:any;
  responsiveName: string[] = [];
  employees: any = [];
  private sub: any;
  email:string;
  dateIn:string;
  dateOut:string;
  rForm: FormGroup;
  myOptions: INgxMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
  };

  ip_address = [];

  constructor(private router: Router,
              private sessionSt: SessionStorageService,
              private services: UserService,
              private fb: FormBuilder,
              public toastr: ToastsManager,
              private modalService: BsModalService,
              private servicesCheck: CheckInService,
              vcr: ViewContainerRef, private route: ActivatedRoute) {
                this.toastr.setRootViewContainerRef(vcr);
    if (this.sessionSt.retrieve('email') == null){
      this.router.navigate([''])
    }
    this.sub = this.route.params.subscribe((params) => {
      this.email = params['email'];
    });
    this.services.getEmployee(this.email).subscribe((data) => {
      // this.nameUser = data.employee.name;
      this.setResponsiveName(data.employee.name);
      this.emailUser = data.employee.email;
      this.imageUser = data.employee.image;
    });
    this.rForm = this.fb.group({
      check_in: ["", Validators.required],
      check_out: [""]
    });
    this.services.getPersonalIP(this.email).subscribe((data) => {
      this.ip_address = data.response_list;
    });
  }

  ngOnInit() {

  }

  backToAccess() {
    this.router.navigate(['access']);
  }

  setSolved(companyTimeTrackerForm: NgForm){
    if (new Date(companyTimeTrackerForm.value.dateIn) > new Date(companyTimeTrackerForm.value.dateOut)){
      this.toastr.error('StartDate should be minor than EndDate', 'Invalid range of date');
      this.ip_address = [];
    }else{
      this.services.getIpFilteredByDate(this.emailUser, companyTimeTrackerForm.value.dateIn,  companyTimeTrackerForm.value.dateOut).subscribe((data) => {
        this.ip_address = data.response_list;
      });
    }
  }

  setResponsiveName(employee){
    let separate = employee.split(" ");
      if(separate.length>3){
        this.nameUser = separate[0]+" "+separate[2];
      }else{
        this.nameUser = separate[0]+" "+separate[1];
      }
  }

  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }

}
