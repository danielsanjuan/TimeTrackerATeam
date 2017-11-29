import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private sessionSt: SessionStorageService,
              private router:Router) { }

  ngOnInit() {
  }

  logout(){
    console.log(this.sessionSt.retrieve('email'));
    this.sessionSt.clear();
    console.log(this.sessionSt.retrieve('email'));
    this.router.navigate(['/login']);
  }

}
