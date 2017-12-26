import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../providers/user.provider';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.css']
})
export class ModalUserComponent implements OnInit {
  
  email: any;
  role: any;
  private sub: any;
  employees: any = {};

  constructor(private route: ActivatedRoute, 
              private services: UserService,
              public toastr: ToastsManager, vcr: ViewContainerRef,) {
    this.toastr.setRootViewContainerRef(vcr);
  }
  
  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.email = params['email'];
      
    });
    this.services.getEmployee(this.email).subscribe((data) => {
      this.employees = data.employee;
      this.role = data.employee.role;
    })
  }
  changeRole() {
    this.services.setRole(this.email).subscribe((data) => {
      this.role = data.employee.role;
      if (data.response_code == 200){
        this.toastr.success('The role have been changed');
      }else{
        this.toastr.warning('The role has not changed, there must be 1 HRM');
      }
    })
  }
}




