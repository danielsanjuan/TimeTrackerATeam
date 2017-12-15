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
    if (this.role == 0){
      this.role = 1;
    } else {
      this.role = 0;
    }
  }
}




