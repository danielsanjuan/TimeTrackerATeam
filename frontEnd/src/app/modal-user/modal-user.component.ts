import { Component, OnInit, ViewContainerRef, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../providers/user.provider';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';



@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.css']
})
export class ModalUserComponent implements OnInit {

  modalRef: BsModalRef;
  selectedRole: any;
  mySelf: any;
  email: any;
  role: any;
  private sub: any;
  employees: any = {};
  constructor(private route: ActivatedRoute,
              private router: Router,
              private services: UserService,
              public toastr: ToastsManager,
              vcr: ViewContainerRef,
              private zone: NgZone) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
  }

  changeRole() {
    this.services.setRole(this.employees.email, this.selectedRole).subscribe((data) => {
      this.role = data.employee.role;
      if (this.role == 0){
        this.toastr.success('The role have been changed to Employee')
        this.employees.role = 0;
      }else if (this.role == 1){
        this.toastr.success('The role have been changed to HRM')
        this.employees.role = 1;
      }else{
        this.toastr.success('The role have been changed to Administrator')
        this.employees.role = 2;
      }
      this.modalRef.hide()
    });
  }
  backToUserList() {
    this.router.navigate(['userList']);
  }
}
