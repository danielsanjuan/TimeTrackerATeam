import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { CheckInService } from '../providers/check-in.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  employees = [];

  constructor(private router: Router, private sessionSt: SessionStorageService, private services: CheckInService) {
    if (this.sessionSt.retrieve('email') == null){
      this.router.navigate([''])
    }
  }

  ngOnInit() {
    this.services.getUserList().subscribe((data) => {
      console.log("entrando en la user list")
      console.log(data);
      this.employees = data.response_report;
    });
  }

}
