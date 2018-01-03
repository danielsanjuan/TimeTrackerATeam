import { Component, OnInit, ViewContainerRef, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../providers/user.provider';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';



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
              private router: Router,
              private services: UserService,
              public toastr: ToastsManager, 
              vcr: ViewContainerRef,
              private zone: NgZone) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    // this.sub = this.route.params.subscribe((params) => {
    //   this.email = params['email'];
    //   console.log(this.email);
    // });
   
  }
  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.services.getEmployee(this.employees.email).subscribe((data) => {
      this.employees = data.employee;
      this.role = data.employee.role;
      console.log(data.employee.role);
    })
  }
  changeRole() {
    this.services.setRole(this.employees.email).subscribe((data) => {
      this.role = data.employee.role;
      if (data.response_code == 200){
        this.role == 0 ? this.toastr.success('The role have been changed to Employee') : this.toastr.success('The role have been changed to HRM')
      }else{
        this.toastr.warning('The role has not changed, there must be 1 HRM');
      }
    });
      if (this.employees.role == 0){
        this.employees.role = 1;
      } else {
        this.employees.role = 0;
      }
  }
  backToUserList() {
    this.router.navigate(['userList']);
  }
}
