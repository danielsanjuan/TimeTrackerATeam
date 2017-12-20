import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../providers/user.provider';


@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.css']
})
export class ModalUserComponent implements OnInit {
  
  email: any;
  role: any;
  private sub: any;
  employees = [];

  constructor(private route: ActivatedRoute, private services: UserService) { }
  
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
      console.log(data.employee.role);
      this.role = data.employee.role;
      
    })
  }
}




