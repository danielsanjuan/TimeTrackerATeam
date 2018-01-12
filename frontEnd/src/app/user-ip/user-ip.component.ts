import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { UserService } from '../providers/user.provider';

@Component({
  selector: 'app-user-ip',
  templateUrl: './user-ip.component.html',
  styleUrls: ['./user-ip.component.css']
})
export class UserIpComponent implements OnInit {

  constructor(private router: Router,
              private sessionSt: SessionStorageService,
              private services: UserService) {
    if (this.sessionSt.retrieve('email') == null){
      this.router.navigate([''])
    }
  }

  employees = [];

  ngOnInit() {
    this.services.getUserList().subscribe((data) => {
      this.employees = data.response_list;
    });
  }



}
